const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);

// Custom error classes for specific error scenarios
class FileLockedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileLockedError';
    }
}

class FileValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileValidationError';
    }
}

class BackupError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BackupError';
    }
}

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DATA_FILE = path.join(DATA_DIR, 'data.xlsx');

// Create data and backup dirs if they don't exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

// Backup helpers
async function createBackup() {
    if (!fs.existsSync(DATA_FILE)) return;  // nothing to backup
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(BACKUP_DIR, `data-${timestamp}.xlsx`);
        await copyFile(DATA_FILE, backupFile);
        
        // Cleanup old backups (keep last 10)
        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith('data-') && f.endsWith('.xlsx'))
            .sort()
            .reverse();
        
        if (backups.length > 10) {
            for (const old of backups.slice(10)) {
                fs.unlinkSync(path.join(BACKUP_DIR, old));
            }
        }
        return backupFile;
    } catch (err) {
        throw new BackupError(`Failed to create backup: ${err.message}`);
    }
}

async function listBackups() {
    try {
        if (!fs.existsSync(BACKUP_DIR)) return [];
        return fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith('data-') && f.endsWith('.xlsx'))
            .map(f => ({
                filename: f,
                path: path.join(BACKUP_DIR, f),
                timestamp: f.replace('data-', '').replace('.xlsx', ''),
                size: fs.statSync(path.join(BACKUP_DIR, f)).size
            }))
            .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    } catch (err) {
        throw new BackupError(`Failed to list backups: ${err.message}`);
    }
}

async function restoreFromBackup(backupFilename) {
    try {
        const backupPath = path.join(BACKUP_DIR, backupFilename);
        if (!fs.existsSync(backupPath)) {
            throw new BackupError('Backup file not found');
        }

        // Validate backup file before restoring
        const wb = XLSX.readFile(backupPath);
        validateExcelFile(wb);

        // Create a backup of current file before restore
        if (fs.existsSync(DATA_FILE)) {
            await createBackup();
        }

        // Restore the backup
        await copyFile(backupPath, DATA_FILE);
        return true;
    } catch (err) {
        if (err instanceof FileValidationError) {
            throw new BackupError(`Invalid backup file: ${err.message}`);
        }
        throw new BackupError(`Failed to restore backup: ${err.message}`);
    }
}

function validateExcelFile(wb) {
    if (!wb.SheetNames || !Array.isArray(wb.SheetNames)) {
        throw new FileValidationError('Invalid Excel file format');
    }

    // Check for required sheets
    const requiredSheets = ['jobs', 'projects', 'settings'];
    const missingSheets = requiredSheets.filter(sheet => !wb.SheetNames.includes(sheet));
    if (missingSheets.length > 0) {
        throw new FileValidationError(`Missing required sheets: ${missingSheets.join(', ')}`);
    }

    // Validate jobs sheet structure
    if (wb.Sheets['jobs']) {
        const jobs = XLSX.utils.sheet_to_json(wb.Sheets['jobs']);
        if (!Array.isArray(jobs)) {
            throw new FileValidationError('Jobs sheet must contain valid data rows');
        }
        // Check for required job fields in at least one row
        if (jobs.length > 0) {
            const requiredJobFields = ['title', 'company'];
            const missingFields = requiredJobFields.filter(field => 
                !Object.keys(jobs[0]).some(key => key.toLowerCase() === field.toLowerCase())
            );
            if (missingFields.length > 0) {
                throw new FileValidationError(`Jobs sheet missing required fields: ${missingFields.join(', ')}`);
            }
        }
    }

    // Similar validation for projects sheet
    if (wb.Sheets['projects']) {
        const projects = XLSX.utils.sheet_to_json(wb.Sheets['projects']);
        if (!Array.isArray(projects)) {
            throw new FileValidationError('Projects sheet must contain valid data rows');
        }
    }

    return true;
}

function readFileData() {
    if (!fs.existsSync(DATA_FILE)) return { jobs: [], projects: [], settings: {} };
    
    try {
        // Try to read with a timeout using a temp file check
        const tempPath = `${DATA_FILE}.tmp`;
        try {
            fs.writeFileSync(tempPath, ''); // Test write access
            fs.unlinkSync(tempPath); // Clean up test file
        } catch (err) {
            throw new FileLockedError('Excel file is currently locked or inaccessible');
        }

        const wb = XLSX.readFile(DATA_FILE, {
            cellDates: true,
            cellNF: false,
            cellText: false
        });

        // Validate file structure
        validateExcelFile(wb);

        const jobs = wb.Sheets['jobs'] ? XLSX.utils.sheet_to_json(wb.Sheets['jobs']) : [];
        const projects = wb.Sheets['projects'] ? XLSX.utils.sheet_to_json(wb.Sheets['projects']) : [];
        const settingsArr = wb.Sheets['settings'] ? XLSX.utils.sheet_to_json(wb.Sheets['settings']) : [];
        const settings = Array.isArray(settingsArr) && settingsArr.length ? settingsArr[0] : {};
        
        return { jobs, projects, settings };
    } catch (err) {
        if (err instanceof FileLockedError) throw err;
        if (err instanceof FileValidationError) throw err;
        throw new Error(`Failed to read Excel file: ${err.message}`);
    }
}

async function writeFileData({ jobs = [], projects = [], settings = {} }) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    
    // Create backup before writing
    await createBackup();
    
    const wb = XLSX.utils.book_new();
    if (Array.isArray(jobs)) {
        const ws = XLSX.utils.json_to_sheet(jobs);
        XLSX.utils.book_append_sheet(wb, ws, 'jobs');
    }
    if (Array.isArray(projects)) {
        const ws = XLSX.utils.json_to_sheet(projects);
        XLSX.utils.book_append_sheet(wb, ws, 'projects');
    }
    // settings as single-row object
    if (settings && Object.keys(settings).length) {
        const ws = XLSX.utils.json_to_sheet([settings]);
        XLSX.utils.book_append_sheet(wb, ws, 'settings');
    }
    XLSX.writeFile(wb, DATA_FILE);
}

// GET current data (jobs/projects/settings)
router.get('/', (req, res) => {
    try {
        const data = readFileData();
        res.json({ success: true, data });
    } catch (err) {
        console.error('filedb read error:', err);
        if (err instanceof FileLockedError) {
            return res.status(423).json({ success: false, error: 'FILE_LOCKED', message: err.message });
        }
        if (err instanceof FileValidationError) {
            return res.status(400).json({ success: false, error: 'INVALID_FILE', message: err.message });
        }
        res.status(500).json({ success: false, error: 'SERVER_ERROR', message: 'Failed to read data file' });
    }
});

// GET raw Excel file download
router.get('/download', (req, res) => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'No data file exists yet' });
        }
        res.download(DATA_FILE, 'devtracker-data.xlsx');
    } catch (err) {
        console.error('filedb download error:', err);
        res.status(500).json({ success: false, error: 'SERVER_ERROR', message: 'Failed to download file' });
    }
});

// POST replace data (body: { jobs, projects, settings })
router.post('/', async (req, res) => {
    try {
        const payload = req.body || {};
        await writeFileData(payload);
        res.json({ success: true, message: 'Data written to Excel file' });
    } catch (err) {
        console.error('filedb write error:', err);
        if (err instanceof FileLockedError) {
            return res.status(423).json({ success: false, error: 'FILE_LOCKED', message: err.message });
        }
        if (err instanceof BackupError) {
            return res.status(500).json({ success: false, error: 'BACKUP_FAILED', message: err.message });
        }
        res.status(500).json({ success: false, error: 'SERVER_ERROR', message: 'Failed to write data file' });
    }
});

// GET list of available backups
router.get('/backups', async (req, res) => {
    try {
        const backups = await listBackups();
        res.json({ success: true, backups });
    } catch (err) {
        console.error('backup list error:', err);
        res.status(500).json({ success: false, error: 'BACKUP_LIST_FAILED', message: err.message });
    }
});

// POST restore from specific backup
router.post('/restore/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        await restoreFromBackup(filename);
        res.json({ success: true, message: 'Backup restored successfully' });
    } catch (err) {
        console.error('backup restore error:', err);
        if (err instanceof BackupError) {
            return res.status(400).json({ success: false, error: 'RESTORE_FAILED', message: err.message });
        }
        res.status(500).json({ success: false, error: 'SERVER_ERROR', message: 'Failed to restore backup' });
    }
});

module.exports = router;
