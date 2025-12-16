// Excel file sync functionality
const ExcelSync = {
    updateStatus: function(message, type = 'info') {
        const el = document.getElementById('excelSyncStatus');
        if (el) {
            el.textContent = message;
            el.style.color = type === 'error' ? 'var(--error)' : 'var(--text-tertiary)';
        }
    },

    saveToExcel: async function() {
        try {
            const payload = {
                jobs: Storage.loadJobs(),
                projects: Storage.loadProjects(),
                settings: Storage.loadSettings()
            };
            
            const res = await fetch('/api/filedb', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            
            Utils.showToast('Data saved to Excel file', 'success');
            this.updateStatus('Last saved: ' + new Date().toLocaleString());
        } catch (err) {
            console.error('Excel save error:', err);
            Utils.showToast('Failed to save Excel file', 'error');
            this.updateStatus('Save failed: ' + err.message, 'error');
        }
    },

    loadFromExcel: async function() {
        try {
            const res = await fetch('/api/filedb');
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            
            const data = json.data;
            if (data.jobs) {
                AppState.jobs = data.jobs;
                Storage.saveJobs(data.jobs);
            }
            if (data.projects) {
                AppState.projects = data.projects;
                Storage.saveProjects(data.projects);
            }
            if (data.settings) {
                AppState.settings = data.settings;
                Storage.saveSettings(data.settings);
            }

            // Update UI
            UI.renderJobs();
            UI.renderProjects();
            Analytics.renderKPIs();
            Analytics.renderCharts();
            
            Utils.showToast('Data loaded from Excel file', 'success');
            this.updateStatus('Last loaded: ' + new Date().toLocaleString());
        } catch (err) {
            console.error('Excel load error:', err);
            Utils.showToast('Failed to load Excel file', 'error');
            this.updateStatus('Load failed: ' + err.message, 'error');
        }
    },

    downloadExcel: async function() {
        try {
            const res = await fetch('/api/filedb/download');
            if (!res.ok) throw new Error('Download failed');
            
            const blob = await res.blob();
            saveAs(blob, 'devtracker-data.xlsx');
            
            Utils.showToast('Excel file downloaded', 'success');
        } catch (err) {
            console.error('Excel download error:', err);
            Utils.showToast('Failed to download Excel file', 'error');
        }
    },

    init: function() {
        // Add event listeners for Excel sync buttons
        const saveBtn = document.getElementById('saveToExcel');
        const loadBtn = document.getElementById('loadFromExcel');
        const downloadBtn = document.getElementById('downloadExcel');
        
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveToExcel());
        if (loadBtn) loadBtn.addEventListener('click', () => this.loadFromExcel());
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadExcel());
        
        // Test if Excel sync is available
        fetch('/api/filedb')
            .then(r => r.ok && this.updateStatus('Excel sync ready'))
            .catch(() => {
                this.updateStatus('Excel sync not available', 'error');
                if (saveBtn) saveBtn.disabled = true;
                if (loadBtn) loadBtn.disabled = true;
                if (downloadBtn) downloadBtn.disabled = true;
            });
    }
};

// Initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ExcelSync.init());
} else {
    ExcelSync.init();
}