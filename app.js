// ========================================
// DATA MODEL & CONFIGURATION
// ========================================
// To add a new field: add it here with metadata, then the UI will auto-generate
const DATA_MODEL = {
    job: {
        company: { label: 'Company', type: 'text', required: true },
        role: { label: 'Role/Title', type: 'text', required: true },
        appliedDate: { label: 'Applied Date', type: 'date', required: true },
        status: { 
            label: 'Status', 
            type: 'select', 
            required: true,
            options: ['Applied', 'Phone', 'Interview', 'Offer', 'Rejected']
        },
        stage: { label: 'Stage', type: 'text', required: false },
        source: { label: 'Source', type: 'text', required: false },
        applicationUrl: { label: 'Application URL', type: 'url', required: false },
        location: { label: 'Location', type: 'text', required: false },
        salary: { label: 'Salary', type: 'text', required: false },
        contactPerson: { label: 'Contact Person', type: 'text', required: false },
        contactEmail: { label: 'Contact Email', type: 'email', required: false },
        notes: { label: 'Notes', type: 'textarea', required: false },
        tags: { label: 'Tags (comma-separated)', type: 'text', required: false },
        nextActionDate: { label: 'Next Action Date', type: 'date', required: false }
    },
    project: {
        title: { label: 'Project Title', type: 'text', required: true },
        description: { label: 'Description', type: 'textarea', required: true },
        techStack: { label: 'Tech Stack (comma-separated)', type: 'text', required: false },
        link: { label: 'Project Link', type: 'url', required: false },
        imageUrl: { label: 'Image URL', type: 'url', required: false },
        isJobRelated: { label: 'Job-Related Project', type: 'checkbox', required: false }
    }
};

// Default social links
const DEFAULT_SOCIAL_LINKS = [
    { platform: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'fab fa-linkedin' },
    { platform: 'Twitter', url: 'https://twitter.com', icon: 'fab fa-twitter' },
    { platform: 'Email', url: 'mailto:your@email.com', icon: 'fas fa-envelope' }
];

// ========================================
// STATE MANAGEMENT
// ========================================
const AppState = {
    jobs: [],
    projects: [],
    socialLinks: [],
    settings: {
        glassIntensity: 5,
        animationsEnabled: true,
        theme: 'dark'
    },
    filters: {
        jobs: { search: '', status: 'all', dateFrom: null, dateTo: null },
        projects: { filter: 'all' }
    },
    currentView: { jobs: 'cards' }
};

// ========================================
// STORAGE LAYER (localStorage + IndexedDB)
// ========================================
const Storage = {
    // Initialize localForage for file storage
    init: async function() {
        if (typeof localforage !== 'undefined') {
            localforage.config({
                name: 'DevTracker',
                storeName: 'files'
            });
        }
    },

    // Jobs
    saveJobs: function(jobs) {
        localStorage.setItem('devtracker_jobs', JSON.stringify(jobs));
    },
    
    loadJobs: function() {
        const data = localStorage.getItem('devtracker_jobs');
        return data ? JSON.parse(data) : [];
    },

    // Projects
    saveProjects: function(projects) {
        localStorage.setItem('devtracker_projects', JSON.stringify(projects));
    },
    
    loadProjects: function() {
        const data = localStorage.getItem('devtracker_projects');
        return data ? JSON.parse(data) : [];
    },

    // Social Links
    saveSocialLinks: function(links) {
        localStorage.setItem('devtracker_social', JSON.stringify(links));
    },
    
    loadSocialLinks: function() {
        const data = localStorage.getItem('devtracker_social');
        return data ? JSON.parse(data) : DEFAULT_SOCIAL_LINKS;
    },

    // Settings
    saveSettings: function(settings) {
        localStorage.setItem('devtracker_settings', JSON.stringify(settings));
    },
    
    loadSettings: function() {
        const data = localStorage.getItem('devtracker_settings');
        return data ? JSON.parse(data) : AppState.settings;
    },

    // Resume (IndexedDB via localForage)
    saveResume: async function(file) {
        if (typeof localforage !== 'undefined') {
            await localforage.setItem('resume', file);
        }
    },
    
    loadResume: async function() {
        if (typeof localforage !== 'undefined') {
            return await localforage.getItem('resume');
        }
        return null;
    },
    
    deleteResume: async function() {
        if (typeof localforage !== 'undefined') {
            await localforage.removeItem('resume');
        }
    },

    // Per-Job Resume (IndexedDB via localForage)
    saveJobResume: async function(jobId, file) {
        if (typeof localforage !== 'undefined') {
            await localforage.setItem(`job_resume_${jobId}`, file);
        }
    },
    loadJobResume: async function(jobId) {
        if (typeof localforage !== 'undefined') {
            return await localforage.getItem(`job_resume_${jobId}`);
        }
        return null;
    },
    deleteJobResume: async function(jobId) {
        if (typeof localforage !== 'undefined') {
            await localforage.removeItem(`job_resume_${jobId}`);
        }
    },

    // Full backup/restore
    exportAll: function() {
        return {
            jobs: AppState.jobs,
            projects: AppState.projects,
            socialLinks: AppState.socialLinks,
            settings: AppState.settings,
            version: '1.0.0',
            exportDate: new Date().toISOString()
        };
    },
    
    importAll: function(data) {
        if (data.jobs) {
            AppState.jobs = data.jobs;
            this.saveJobs(data.jobs);
        }
        if (data.projects) {
            AppState.projects = data.projects;
            this.saveProjects(data.projects);
        }
        if (data.socialLinks) {
            AppState.socialLinks = data.socialLinks;
            this.saveSocialLinks(data.socialLinks);
        }
        if (data.settings) {
            AppState.settings = data.settings;
            this.saveSettings(data.settings);
        }
    }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
const Utils = {
    // Generate unique ID
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Format date
    formatDate: function(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    // Calculate days difference
    daysDifference: function(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diff = Math.abs(d2 - d1);
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },

    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    // Show toast notification
    showToast: function(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="toast-icon fas ${icons[type]}"></i>
            <div class="toast-content">
                <p>${message}</p>
            </div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlide 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Download file
    downloadFile: function(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        saveAs(blob, filename);
    }
};

// ========================================
// ANALYTICS & CHARTS
// ========================================
const Analytics = {
    calculateKPIs: function() {
        const jobs = AppState.jobs;
        const totalApps = jobs.length;
        const interviews = jobs.filter(j => j.status === 'Interview' || j.status === 'Offer').length;
        const offers = jobs.filter(j => j.status === 'Offer').length;
        const responses = jobs.filter(j => j.status !== 'Applied').length;
        const responseRate = totalApps > 0 ? ((responses / totalApps) * 100).toFixed(1) : 0;
        
        // Calculate average time to offer
        const offeredJobs = jobs.filter(j => j.status === 'Offer' && j.appliedDate);
        let avgTimeToOffer = 0;
        if (offeredJobs.length > 0) {
            const totalDays = offeredJobs.reduce((sum, job) => {
                return sum + Utils.daysDifference(job.appliedDate, new Date());
            }, 0);
            avgTimeToOffer = Math.round(totalDays / offeredJobs.length);
        }
        
        return {
            totalApps,
            interviews,
            offers,
            responseRate: `${responseRate}%`,
            avgTimeToOffer: `${avgTimeToOffer}d`
        };
    },

    renderKPIs: function() {
        const kpis = this.calculateKPIs();
        document.getElementById('kpiTotalApps').textContent = kpis.totalApps;
        document.getElementById('kpiInterviews').textContent = kpis.interviews;
        document.getElementById('kpiOffers').textContent = kpis.offers;
        document.getElementById('kpiResponseRate').textContent = kpis.responseRate;
        document.getElementById('kpiAvgTime').textContent = kpis.avgTimeToOffer;
    },

    renderCharts: function() {
        this.renderApplicationsTimeChart();
        this.renderStatusDistributionChart();
        this.renderConversionFunnelChart();
        this.renderTagsBreakdownChart();
        this.renderTopCompaniesTable();
    },

    renderApplicationsTimeChart: function() {
        const ctx = document.getElementById('applicationsTimeChart');
        if (!ctx) return;
        
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded yet');
            ctx.parentElement.innerHTML = '<p style="text-align: center; color: #7a86b6; padding: 40px;">Chart library loading...</p>';
            return;
        }

        // Group jobs by month
        const monthlyData = {};
        AppState.jobs.forEach(job => {
            if (job.appliedDate) {
                const date = new Date(job.appliedDate);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
            }
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        const labels = sortedMonths.map(m => {
            const [year, month] = m.split('-');
            return new Date(year, month - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        });
        const data = sortedMonths.map(m => monthlyData[m]);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Applications',
                    data: data,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { color: '#b8c1ec' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    x: { 
                        ticks: { color: '#b8c1ec' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    }
                }
            }
        });
    },

    renderStatusDistributionChart: function() {
        const ctx = document.getElementById('statusDistributionChart');
        if (!ctx) return;
        
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded yet');
            return;
        }

        const statusCounts = {};
        AppState.jobs.forEach(job => {
            statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
        });

        const colors = {
            'Applied': '#00d4ff',
            'Phone': '#ffaa00',
            'Interview': '#7000ff',
            'Offer': '#00ff88',
            'Rejected': '#ff3366'
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: Object.keys(statusCounts).map(s => colors[s])
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: { color: '#b8c1ec' }
                    }
                }
            }
        });
    },

    renderConversionFunnelChart: function() {
        const ctx = document.getElementById('conversionFunnelChart');
        if (!ctx) return;
        
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded yet');
            return;
        }

        const applied = AppState.jobs.filter(j => j.status === 'Applied').length;
        const phone = AppState.jobs.filter(j => j.status === 'Phone').length;
        const interview = AppState.jobs.filter(j => j.status === 'Interview').length;
        const offer = AppState.jobs.filter(j => j.status === 'Offer').length;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Applied', 'Phone Screen', 'Interview', 'Offer'],
                datasets: [{
                    label: 'Applications',
                    data: [applied, phone, interview, offer],
                    backgroundColor: ['#00d4ff', '#ffaa00', '#7000ff', '#00ff88']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        beginAtZero: true,
                        ticks: { color: '#b8c1ec' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    y: { 
                        ticks: { color: '#b8c1ec' },
                        grid: { display: false }
                    }
                }
            }
        });
    },

    renderTagsBreakdownChart: function() {
        const ctx = document.getElementById('tagsBreakdownChart');
        if (!ctx) return;
        
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded yet');
            return;
        }

        const tagCounts = {};
        AppState.jobs.forEach(job => {
            if (job.tags) {
                const tags = job.tags.split(',').map(t => t.trim()).filter(t => t);
                tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });

        const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedTags.map(t => t[0]),
                datasets: [{
                    label: 'Count',
                    data: sortedTags.map(t => t[1]),
                    backgroundColor: '#00d4ff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        beginAtZero: true,
                        ticks: { color: '#b8c1ec' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    y: { 
                        ticks: { color: '#b8c1ec' },
                        grid: { display: false }
                    }
                }
            }
        });
    },

    renderTopCompaniesTable: function() {
        const container = document.getElementById('topCompaniesTable');
        if (!container) return;

        const companyCounts = {};
        AppState.jobs.forEach(job => {
            companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
        });

        const sortedCompanies = Object.entries(companyCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
        
        const html = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <th style="padding: 12px; text-align: left; color: #b8c1ec;">Company</th>
                        <th style="padding: 12px; text-align: center; color: #b8c1ec;">Applications</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedCompanies.map(([company, count]) => `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 12px; color: #ffffff;">${company}</td>
                            <td style="padding: 12px; text-align: center; color: #00d4ff; font-weight: 600;">${count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = html || '<p style="text-align: center; color: #7a86b6; padding: 20px;">No data available</p>';
    }
};

// ========================================
// UI RENDERING
// ========================================
const UI = {
    renderJobs: function() {
        const container = document.getElementById('jobsContainer');
        if (!container) return;

        let jobs = AppState.jobs;

        // Apply filters
        const { search, status, dateFrom, dateTo } = AppState.filters.jobs;
        
        if (search) {
            jobs = jobs.filter(job => 
                job.company.toLowerCase().includes(search.toLowerCase()) ||
                job.role.toLowerCase().includes(search.toLowerCase()) ||
                (job.tags && job.tags.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (status && status !== 'all') {
            jobs = jobs.filter(job => job.status === status);
        }

        if (dateFrom) {
            jobs = jobs.filter(job => new Date(job.appliedDate) >= new Date(dateFrom));
        }

        if (dateTo) {
            jobs = jobs.filter(job => new Date(job.appliedDate) <= new Date(dateTo));
        }

        // Check view type
        const viewType = AppState.currentView.jobs;
        container.className = viewType === 'list' ? 'jobs-list' : 'jobs-grid';

        if (jobs.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-briefcase"></i>
                    <h3>No job applications yet</h3>
                    <p>Start tracking your job search by adding your first application.</p>
                    <button class="btn-primary" onclick="UI.openJobModal()">
                        <i class="fas fa-plus"></i> Add First Job
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = jobs.map(job => this.renderJobCard(job)).join('');
    },

    renderJobCard: function(job) {
        const tags = job.tags ? job.tags.split(',').map(t => t.trim()).filter(t => t) : [];
        let linkLabel = null;
        if (job.applicationUrl) {
            try {
                const u = new URL(job.applicationUrl);
                linkLabel = u.hostname.replace(/^www\./, '');
            } catch (e) {
                linkLabel = 'Link';
            }
        }
        
        return `
            <div class="job-card" data-id="${job.id}" role="button" tabindex="0" aria-label="View details for ${job.role} at ${job.company}" onclick="UI.openJobDetails('${job.id}')" onkeydown="if(event.key==='Enter'){UI.openJobDetails('${job.id}')}" >
                <div class="job-card-header">
                    <div class="job-card-title">
                        <h3>${job.company}</h3>
                        <p>${job.role}</p>
                    </div>
                    <span class="status-badge ${job.status.toLowerCase()}">${job.status}</span>
                </div>
                
                <div class="job-card-body">
                    <div class="job-card-meta">
                        <div class="job-card-meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>Applied: ${Utils.formatDate(job.appliedDate)}</span>
                        </div>
                        ${job.location ? `
                            <div class="job-card-meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${job.location}</span>
                            </div>
                        ` : ''}
                        ${job.salary ? `
                            <div class="job-card-meta-item">
                                <i class="fas fa-dollar-sign"></i>
                                <span>${job.salary}</span>
                            </div>
                        ` : ''}
                        ${job.nextActionDate ? `
                            <div class="job-card-meta-item">
                                <i class="fas fa-clock"></i>
                                <span>Next: ${Utils.formatDate(job.nextActionDate)}</span>
                            </div>
                        ` : ''}
                        ${job.applicationUrl ? `
                            <div class="job-card-meta-item">
                                <i class="fas fa-link"></i>
                                <a href="${job.applicationUrl}" target="_blank" rel="noopener">${linkLabel}</a>
                            </div>
                        ` : ''}
                        ${job.resume ? `
                            <div class="job-card-meta-item">
                                <i class="fas fa-paperclip"></i>
                                <span>Resume: ${job.resume.name}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${tags.length > 0 ? `
                        <div class="job-card-tags">
                            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="job-card-actions">
                    <button onclick="event.stopPropagation(); UI.openJobModal('${job.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="event.stopPropagation(); UI.duplicateJob('${job.id}')">
                        <i class="fas fa-copy"></i> Duplicate
                    </button>
                    <button onclick="event.stopPropagation(); UI.deleteJob('${job.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    ${job.resume ? `
                        <button onclick="event.stopPropagation(); UI.previewJobResume('${job.id}')">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    openJobDetails: function(jobId) {
        const job = AppState.jobs.find(j => j.id === jobId);
        if (!job) return;

        // Helper to format values and links
        const fmt = (key, val) => {
            if (!val) return 'N/A';
            if (key === 'appliedDate' || key === 'nextActionDate') return Utils.formatDate(val);
            if (key === 'contactEmail') return `<a href="mailto:${val}">${val}</a>`;
            if (key === 'source') {
                const looksUrl = /^https?:\/\//i.test(val);
                return looksUrl ? `<a href="${val}" target="_blank" rel="noopener">${val}</a>` : val;
            }
            if (key === 'applicationUrl') {
                return `<a href="${val}" target="_blank" rel="noopener">${val}</a>`;
            }
            return val;
        };

        const fieldsHtml = Object.keys(DATA_MODEL.job).map(key => {
            const label = DATA_MODEL.job[key].label;
            const value = job[key] || '';
            if (key === 'tags') {
                const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];
                return `
                    <div class="details-item">
                        <div class="details-label">${label}</div>
                        <div class="details-value">${tags.length ? tags.map(t => `<span class='tag'>${t}</span>`).join(' ') : 'N/A'}</div>
                    </div>`;
            }
            if (key === 'notes') {
                return `
                    <div class="details-item details-notes">
                        <div class="details-label">${label}</div>
                        <div class="details-value"><div class="notes-box">${value ? value.replace(/\n/g, '<br>') : 'N/A'}</div></div>
                    </div>`;
            }
            return `
                <div class="details-item">
                    <div class="details-label">${label}</div>
                    <div class="details-value">${fmt(key, value)}</div>
                </div>`;
        }).join('');

        const resumeControls = job.resume ? `
            <button class="btn-secondary compact" onclick="UI.previewJobResume('${job.id}')"><i class="fas fa-eye"></i> Preview Resume</button>
        ` : '<span class="details-muted">No resume attached</span>';

        const modal = `
            <div class="modal-overlay" id="jobDetailsModal">
                <div class="modal" style="max-width: 800px;">
                    <div class="modal-header">
                        <h2>${job.company} — ${job.role}</h2>
                        <button class="modal-close" onclick="UI.closeModal('jobDetailsModal')"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="details-header">
                            <span class="status-badge ${job.status.toLowerCase()}">${job.status}</span>
                            <div class="details-actions">
                                ${resumeControls}
                                <button class="btn-primary compact" onclick="UI.closeModal('jobDetailsModal'); UI.openJobModal('${job.id}')"><i class="fas fa-edit"></i> Edit</button>
                            </div>
                        </div>
                        <div class="details-grid">
                            ${fieldsHtml}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="UI.closeModal('jobDetailsModal')">Close</button>
                    </div>
                </div>
            </div>`;

        document.getElementById('modalContainer').innerHTML = modal;
    },

    renderProjects: function() {
        const container = document.getElementById('projectsContainer');
        if (!container) return;

        let projects = AppState.projects;

        // Apply filter
        const filter = AppState.filters.projects.filter;
        if (filter === 'portfolio') {
            projects = projects.filter(p => !p.isJobRelated);
        } else if (filter === 'job-related') {
            projects = projects.filter(p => p.isJobRelated);
        }

        if (projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-rocket"></i>
                    <h3>No projects yet</h3>
                    <p>Showcase your work by adding your first project.</p>
                    <button class="btn-primary" onclick="UI.openProjectModal()">
                        <i class="fas fa-plus"></i> Add First Project
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = projects.map(project => this.renderProjectCard(project)).join('');
    },

    renderProjectCard: function(project) {
        const techStack = project.techStack ? project.techStack.split(',').map(t => t.trim()).filter(t => t) : [];
        
        return `
            <div class="project-card">
                <div class="project-card-image">
                    ${project.imageUrl ? 
                        `<img src="${project.imageUrl}" alt="${project.title}">` : 
                        '<i class="fas fa-code"></i>'
                    }
                </div>
                <div class="project-card-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    
                    ${techStack.length > 0 ? `
                        <div class="project-tech-stack">
                            ${techStack.map(tech => `<span class="tag">${tech}</span>`).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="project-card-footer">
                        ${project.link ? `<a href="${project.link}" target="_blank"><i class="fas fa-external-link-alt"></i> View</a>` : ''}
                        <a href="#" onclick="UI.openProjectModal('${project.id}'); return false;"><i class="fas fa-edit"></i> Edit</a>
                        <a href="#" onclick="UI.deleteProject('${project.id}'); return false;"><i class="fas fa-trash"></i> Delete</a>
                    </div>
                </div>
            </div>
        `;
    },

    renderSocialLinks: function() {
        const container = document.getElementById('socialLinks');
        if (!container) return;

        container.innerHTML = AppState.socialLinks.map(link => `
            <a href="${link.url}" target="_blank" title="${link.platform}">
                <i class="${link.icon}"></i>
            </a>
        `).join('');
    },

    renderSocialLinksSettings: function() {
        const container = document.getElementById('socialLinksSettings');
        if (!container) return;

        container.innerHTML = AppState.socialLinks.map((link, index) => `
            <div class="setting-item" style="display: flex; gap: 8px; margin-bottom: 12px;">
                <input type="text" class="input-field" value="${link.platform}" 
                    onchange="AppState.socialLinks[${index}].platform = this.value; Storage.saveSocialLinks(AppState.socialLinks);" 
                    placeholder="Platform" style="flex: 1;">
                <input type="text" class="input-field" value="${link.url}" 
                    onchange="AppState.socialLinks[${index}].url = this.value; Storage.saveSocialLinks(AppState.socialLinks); UI.renderSocialLinks();" 
                    placeholder="URL" style="flex: 2;">
                <button class="btn-danger" style="padding: 8px 12px;" onclick="UI.removeSocialLink(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    },

    renderResumeStatus: async function() {
        const container = document.getElementById('resumeStatus');
        if (!container) return;

        const resume = await Storage.loadResume();
        
        if (resume) {
            const sizeKB = (resume.size / 1024).toFixed(2);
            container.innerHTML = `
                <p style="color: #00ff88; margin-bottom: 12px;">
                    <i class="fas fa-check-circle"></i> ${resume.name} (${sizeKB} KB)
                </p>
                <button class="btn-secondary" onclick="UI.downloadResume()" style="margin-bottom: 8px;">
                    <i class="fas fa-download"></i> Download Resume
                </button>
                <button class="btn-danger" onclick="UI.deleteResume()">
                    <i class="fas fa-trash"></i> Remove Resume
                </button>
            `;
        } else {
            container.innerHTML = '<p style="color: #7a86b6;">No resume uploaded</p>';
        }
    },

    // Modal management
    openJobModal: function(jobId = null) {
        const job = jobId ? AppState.jobs.find(j => j.id === jobId) : null;
        const isEdit = !!job;
        
        const formFields = Object.entries(DATA_MODEL.job).map(([key, field]) => {
            const value = job ? (job[key] || '') : '';
            
            if (field.type === 'select') {
                return `
                    <div class="form-group">
                        <label for="${key}">${field.label} ${field.required ? '*' : ''}</label>
                        <select id="${key}" ${field.required ? 'required' : ''}>
                            <option value="">Select ${field.label}</option>
                            ${field.options.map(opt => `
                                <option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>
                            `).join('')}
                        </select>
                    </div>
                `;
            } else if (field.type === 'textarea') {
                return `
                    <div class="form-group">
                        <label for="${key}">${field.label} ${field.required ? '*' : ''}</label>
                        <textarea id="${key}" ${field.required ? 'required' : ''}>${value}</textarea>
                    </div>
                `;
            } else {
                return `
                    <div class="form-group">
                        <label for="${key}">${field.label} ${field.required ? '*' : ''}</label>
                        <input type="${field.type}" id="${key}" value="${value}" ${field.required ? 'required' : ''}>
                    </div>
                `;
            }
        }).join('');

        const resumeSection = `
            <div class="form-group" id="jobResumeSection">
                <label>Resume used for this application</label>
                ${job && job.resume ? `
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px; color: var(--text-secondary);">
                        <i class="fas fa-paperclip" style="color: var(--accent-primary);"></i>
                        <span style="flex:1;">${job.resume.name} (${(job.resume.size/1024).toFixed(1)} KB)</span>
                        <button type="button" class="btn-secondary compact" onclick="UI.previewJobResume('${job.id}')"><i class="fas fa-eye"></i> Preview</button>
                        <button type="button" class="btn-danger compact" onclick="UI.removeJobResume('${job.id}')"><i class="fas fa-trash"></i> Remove</button>
                    </div>
                ` : `
                    <p style="color: var(--text-tertiary); margin-bottom:8px;">No resume attached</p>
                `}
                <label class="btn-secondary file-input-label">
                    <i class="fas fa-upload"></i> ${job && job.resume ? 'Replace Resume' : 'Upload Resume'}
                    <input type="file" id="jobResumeFile" accept=".pdf,.doc,.docx" hidden>
                </label>
                <p style="font-size: 0.8rem; color: var(--text-tertiary); margin-top:6px;">Stored locally only; included in backups only as metadata.</p>
            </div>
        `;

        const modal = `
            <div class="modal-overlay" id="jobModal">
                <div class="modal">
                    <div class="modal-header">
                        <h2>${isEdit ? 'Edit Job Application' : 'Add Job Application'}</h2>
                        <button class="modal-close" onclick="UI.closeModal('jobModal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="jobForm">
                            ${formFields}
                            ${resumeSection}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="UI.closeModal('jobModal')">Cancel</button>
                        <button class="btn-primary" onclick="UI.saveJob('${jobId || ''}')">
                            ${isEdit ? 'Update' : 'Add'} Job
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalContainer').innerHTML = modal;
    },

    openProjectModal: function(projectId = null) {
        const project = projectId ? AppState.projects.find(p => p.id === projectId) : null;
        const isEdit = !!project;
        
        const formFields = Object.entries(DATA_MODEL.project).map(([key, field]) => {
            const value = project ? (project[key] || '') : '';
            
            if (field.type === 'textarea') {
                return `
                    <div class="form-group">
                        <label for="${key}">${field.label} ${field.required ? '*' : ''}</label>
                        <textarea id="${key}" ${field.required ? 'required' : ''}>${value}</textarea>
                    </div>
                `;
            } else if (field.type === 'checkbox') {
                return `
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="${key}" ${value ? 'checked' : ''}>
                            ${field.label}
                        </label>
                    </div>
                `;
            } else {
                return `
                    <div class="form-group">
                        <label for="${key}">${field.label} ${field.required ? '*' : ''}</label>
                        <input type="${field.type}" id="${key}" value="${value}" ${field.required ? 'required' : ''}>
                    </div>
                `;
            }
        }).join('');

        const modal = `
            <div class="modal-overlay" id="projectModal">
                <div class="modal">
                    <div class="modal-header">
                        <h2>${isEdit ? 'Edit Project' : 'Add Project'}</h2>
                        <button class="modal-close" onclick="UI.closeModal('projectModal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="projectForm">
                            ${formFields}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="UI.closeModal('projectModal')">Cancel</button>
                        <button class="btn-primary" onclick="UI.saveProject('${projectId || ''}')">
                            ${isEdit ? 'Update' : 'Add'} Project
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalContainer').innerHTML = modal;
    },

    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.animation = 'fadeIn 0.2s ease reverse';
            setTimeout(() => modal.remove(), 200);
        }
    },

    saveJob: async function(jobId) {
        const form = document.getElementById('jobForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const jobData = {};
        Object.keys(DATA_MODEL.job).forEach(key => {
            const element = document.getElementById(key);
            jobData[key] = element ? element.value : '';
        });

        // Handle resume file input
        const resumeInput = document.getElementById('jobResumeFile');
        const selectedFile = resumeInput && resumeInput.files && resumeInput.files[0] ? resumeInput.files[0] : null;
        if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
            Utils.showToast('Resume file too large (max 10MB)', 'error');
            return;
        }

        if (jobId) {
            const index = AppState.jobs.findIndex(j => j.id === jobId);
            // Preserve existing resume metadata unless replaced
            const existing = AppState.jobs[index];
            AppState.jobs[index] = { ...existing, ...jobData };
            // Replace resume if new file selected
            if (selectedFile) {
                await Storage.saveJobResume(jobId, selectedFile);
                AppState.jobs[index].resume = {
                    name: selectedFile.name,
                    size: selectedFile.size,
                    type: selectedFile.type || 'application/octet-stream',
                    uploadedAt: new Date().toISOString()
                };
            }
            Utils.showToast('Job updated successfully', 'success');
        } else {
            jobData.id = Utils.generateId();
            // Attach resume if provided
            if (selectedFile) {
                await Storage.saveJobResume(jobData.id, selectedFile);
                jobData.resume = {
                    name: selectedFile.name,
                    size: selectedFile.size,
                    type: selectedFile.type || 'application/octet-stream',
                    uploadedAt: new Date().toISOString()
                };
            }
            AppState.jobs.unshift(jobData);
            Utils.showToast('Job added successfully', 'success');
        }

        Storage.saveJobs(AppState.jobs);
        this.renderJobs();
        Analytics.renderKPIs();
        this.closeModal('jobModal');
    },

    saveProject: function(projectId) {
        const form = document.getElementById('projectForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const projectData = {};
        Object.keys(DATA_MODEL.project).forEach(key => {
            const element = document.getElementById(key);
            if (element.type === 'checkbox') {
                projectData[key] = element.checked;
            } else {
                projectData[key] = element ? element.value : '';
            }
        });

        if (projectId) {
            const index = AppState.projects.findIndex(p => p.id === projectId);
            AppState.projects[index] = { ...AppState.projects[index], ...projectData };
            Utils.showToast('Project updated successfully', 'success');
        } else {
            projectData.id = Utils.generateId();
            AppState.projects.unshift(projectData);
            Utils.showToast('Project added successfully', 'success');
        }

        Storage.saveProjects(AppState.projects);
        this.renderProjects();
        this.closeModal('projectModal');
    },

    deleteJob: async function(jobId) {
        if (confirm('Are you sure you want to delete this job application?')) {
            // Remove attached resume if exists
            const job = AppState.jobs.find(j => j.id === jobId);
            if (job && job.resume) {
                await Storage.deleteJobResume(jobId);
            }
            AppState.jobs = AppState.jobs.filter(j => j.id !== jobId);
            Storage.saveJobs(AppState.jobs);
            this.renderJobs();
            Analytics.renderKPIs();
            Analytics.renderCharts();
            Utils.showToast('Job deleted successfully', 'success');
        }
    },

    duplicateJob: function(jobId) {
        const job = AppState.jobs.find(j => j.id === jobId);
        if (job) {
            const newJob = { ...job, id: Utils.generateId() };
            // Do not carry over attached resume blob; clear metadata
            if (newJob.resume) delete newJob.resume;
            AppState.jobs.unshift(newJob);
            Storage.saveJobs(AppState.jobs);
            this.renderJobs();
            Utils.showToast('Job duplicated successfully', 'success');
        }
    },

    deleteProject: function(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            AppState.projects = AppState.projects.filter(p => p.id !== projectId);
            Storage.saveProjects(AppState.projects);
            this.renderProjects();
            Utils.showToast('Project deleted successfully', 'success');
        }
    },

    addSocialLink: function() {
        AppState.socialLinks.push({ platform: 'New Platform', url: 'https://', icon: 'fas fa-link' });
        Storage.saveSocialLinks(AppState.socialLinks);
        this.renderSocialLinksSettings();
        this.renderSocialLinks();
    },

    removeSocialLink: function(index) {
        AppState.socialLinks.splice(index, 1);
        Storage.saveSocialLinks(AppState.socialLinks);
        this.renderSocialLinksSettings();
        this.renderSocialLinks();
    },

    downloadResume: async function() {
        const resume = await Storage.loadResume();
        if (resume) {
            saveAs(resume, resume.name);
            Utils.showToast('Resume downloaded', 'success');
        } else {
            Utils.showToast('No resume uploaded yet', 'info');
        }
    },

    openResumeInNewTab: async function() {
        const resume = await Storage.loadResume();
        if (!resume) {
            Utils.showToast('No resume uploaded yet', 'info');
            return;
        }
        try {
            const url = URL.createObjectURL(resume);
            window.open(url, '_blank', 'noopener');
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        } catch (e) {
            saveAs(resume, resume.name || 'resume');
        }
    },

    deleteResume: async function() {
        if (confirm('Are you sure you want to delete your resume?')) {
            await Storage.deleteResume();
            this.renderResumeStatus();
            Utils.showToast('Resume deleted', 'success');
        }
    },

    // Per-job resume actions
    previewJobResume: async function(jobId) {
        const file = await Storage.loadJobResume(jobId);
        if (!file) {
            Utils.showToast('No resume attached to this job', 'info');
            return;
        }
        const url = URL.createObjectURL(file);
        const filename = file.name || 'resume';
        const modalHtml = `
            <div class="modal-overlay" id="resumePreviewModal" data-url="${url}">
                <div class="modal" style="max-width: 900px; width: 95%; height: 85vh; display:flex; flex-direction:column;">
                    <div class="modal-header">
                        <h2>Preview: ${filename}</h2>
                        <div style="display:flex; gap:8px;">
                            <button class="btn-secondary compact" onclick="window.open('${url}', '_blank')"><i class="fas fa-external-link-alt"></i> Open in new tab</button>
                            <button class="modal-close" onclick="UI.closePreviewModal()"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div class="modal-body" style="flex:1; padding:0;">
                        <iframe src="${url}" title="Resume Preview" style="border:0; width:100%; height:100%; background: var(--bg-secondary);"></iframe>
                    </div>
                </div>
            </div>`;
        document.getElementById('modalContainer').innerHTML = modalHtml;
    },
    closePreviewModal: function() {
        const overlay = document.getElementById('resumePreviewModal');
        if (overlay) {
            const url = overlay.getAttribute('data-url');
            overlay.style.animation = 'fadeIn 0.2s ease reverse';
            setTimeout(() => {
                overlay.remove();
                if (url) URL.revokeObjectURL(url);
            }, 200);
        }
    },
    removeJobResume: async function(jobId) {
        const job = AppState.jobs.find(j => j.id === jobId);
        if (!job || !job.resume) {
            Utils.showToast('No resume to remove', 'info');
            return;
        }
        if (confirm('Remove attached resume from this job?')) {
            await Storage.deleteJobResume(jobId);
            // Clear metadata
            const index = AppState.jobs.findIndex(j => j.id === jobId);
            if (index !== -1) {
                delete AppState.jobs[index].resume;
                Storage.saveJobs(AppState.jobs);
            }
            // Update UI (jobs list)
            UI.renderJobs();
            // Update resume section in modal if open
            const section = document.getElementById('jobResumeSection');
            if (section) {
                section.innerHTML = `
                    <label>Resume used for this application</label>
                    <p style="color: var(--text-tertiary); margin-bottom:8px;">No resume attached</p>
                    <label class=\"btn-secondary file-input-label\">\n                        <i class=\"fas fa-upload\"></i> Upload Resume\n                        <input type=\"file\" id=\"jobResumeFile\" accept=\".pdf,.doc,.docx\" hidden>\n                    </label>\n                    <p style=\"font-size: 0.8rem; color: var(--text-tertiary); margin-top:6px;\">Stored locally only; included in backups only as metadata.</p>
                `;
            }
            Utils.showToast('Resume removed from job', 'success');
        }
    }
};

// ========================================
// EXPORT/IMPORT FUNCTIONS
// ========================================
const ExportImport = {
    exportToExcel: function() {
        if (typeof XLSX === 'undefined') {
            Utils.showToast('Excel library not loaded', 'error');
            return;
        }

        const jobs = AppState.jobs.map(job => ({
            Company: job.company,
            Role: job.role,
            'Applied Date': job.appliedDate,
            Status: job.status,
            Stage: job.stage || '',
            Source: job.source || '',
            'Application URL': job.applicationUrl || '',
            Location: job.location || '',
            Salary: job.salary || '',
            'Contact Person': job.contactPerson || '',
            'Contact Email': job.contactEmail || '',
            Tags: job.tags || '',
            'Next Action Date': job.nextActionDate || '',
            Notes: job.notes || '',
            'Resume Attached': job.resume ? 'Yes' : 'No',
            'Resume Name': job.resume ? (job.resume.name || '') : ''
        }));

        const ws = XLSX.utils.json_to_sheet(jobs);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Job Applications');

        XLSX.writeFile(wb, `job-tracker-${new Date().toISOString().split('T')[0]}.xlsx`);
        Utils.showToast('Exported to Excel successfully', 'success');
    },

    exportToWord: async function() {
        if (typeof docx === 'undefined') {
            Utils.showToast('Word library not loaded', 'error');
            return;
        }

        const { Document, Paragraph, TextRun, Table, TableCell, TableRow, WidthType } = docx;

        const children = [
            new Paragraph({
                children: [
                    new TextRun({
                        text: 'Job Application Tracker Report',
                        bold: true,
                        size: 32
                    })
                ]
            }),
            new Paragraph({ text: `Generated: ${new Date().toLocaleDateString()}`, spacing: { after: 400 } })
        ];

        AppState.jobs.forEach(job => {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: job.company, bold: true, size: 28 })],
                    spacing: { before: 300 }
                }),
                new Paragraph({ text: `Role: ${job.role}` }),
                new Paragraph({ text: `Status: ${job.status}` }),
                new Paragraph({ text: `Applied: ${Utils.formatDate(job.appliedDate)}` }),
                new Paragraph({ text: `Location: ${job.location || 'N/A'}` }),
                new Paragraph({ text: `Application URL: ${job.applicationUrl || 'N/A'}` }),
                new Paragraph({ text: `Resume Attached: ${job.resume ? 'Yes' : 'No'}` }),
                ...(job.resume && job.resume.name ? [new Paragraph({ text: `Resume Name: ${job.resume.name}` })] : []),
                new Paragraph({ text: `Notes: ${job.notes || 'N/A'}`, spacing: { after: 200 } })
            );
        });

        const doc = new Document({ sections: [{ children }] });
        const blob = await docx.Packer.toBlob(doc);
        saveAs(blob, `job-tracker-${new Date().toISOString().split('T')[0]}.docx`);
        Utils.showToast('Exported to Word successfully', 'success');
    },

    exportToCSV: function() {
        const baseHeaders = Object.keys(DATA_MODEL.job).map(key => DATA_MODEL.job[key].label);
        const headers = [...baseHeaders, 'Resume Attached', 'Resume Name'];
        const rows = AppState.jobs.map(job => [
            ...Object.keys(DATA_MODEL.job).map(key => job[key] || ''),
            job.resume ? 'Yes' : 'No',
            job.resume ? (job.resume.name || '') : ''
        ]);
        
        let csv = headers.join(',') + '\n';
        csv += rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
        
        Utils.downloadFile(csv, `job-tracker-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        Utils.showToast('Exported to CSV successfully', 'success');
    },

    exportJSON: function() {
        const data = Storage.exportAll();
        Utils.downloadFile(JSON.stringify(data, null, 2), `devtracker-backup-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
        Utils.showToast('Data backup created successfully', 'success');
    },

    importExcel: function(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                
                const importedJobs = jsonData.map(row => ({
                    id: Utils.generateId(),
                    company: row.Company || '',
                    role: row.Role || '',
                    appliedDate: row['Applied Date'] || '',
                    status: row.Status || 'Applied',
                    stage: row.Stage || '',
                    source: row.Source || '',
                    applicationUrl: row['Application URL'] || '',
                    location: row.Location || '',
                    salary: row.Salary || '',
                    contactPerson: row['Contact Person'] || '',
                    contactEmail: row['Contact Email'] || '',
                    tags: row.Tags || '',
                    nextActionDate: row['Next Action Date'] || '',
                    notes: row.Notes || ''
                }));

                AppState.jobs = [...importedJobs, ...AppState.jobs];
                Storage.saveJobs(AppState.jobs);
                UI.renderJobs();
                Analytics.renderKPIs();
                Analytics.renderCharts();
                Utils.showToast(`Imported ${importedJobs.length} jobs successfully`, 'success');
            } catch (error) {
                Utils.showToast('Failed to import Excel file', 'error');
                console.error(error);
            }
        };
        reader.readAsArrayBuffer(file);
    },

    importJSON: function(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                Storage.importAll(data);
                
                // Reload UI
                UI.renderJobs();
                UI.renderProjects();
                UI.renderSocialLinks();
                UI.renderSocialLinksSettings();
                Analytics.renderKPIs();
                Analytics.renderCharts();
                
                Utils.showToast('Data restored successfully', 'success');
            } catch (error) {
                Utils.showToast('Failed to import data', 'error');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }
};

// ========================================
// EVENT LISTENERS
// ========================================
function initializeEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.dataset.tab;
            
            console.log('Tab clicked:', tabName);
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Update panels
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            const targetPanel = document.getElementById(`${tabName}-panel`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                console.log('Panel activated:', `${tabName}-panel`);
            } else {
                console.error('Panel not found:', `${tabName}-panel`);
            }

            // Render charts when dashboard is opened
            if (tabName === 'dashboard') {
                setTimeout(() => {
                    try {
                        Analytics.renderCharts();
                    } catch (error) {
                        console.error('Error rendering charts:', error);
                    }
                }, 100);
            }
        });
    });

    // Job search
    const jobSearch = document.getElementById('jobSearch');
    if (jobSearch) {
        jobSearch.addEventListener('input', Utils.debounce(function(e) {
            AppState.filters.jobs.search = e.target.value;
            UI.renderJobs();
        }, 300));
    }

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            AppState.currentView.jobs = this.dataset.view;
            UI.renderJobs();
        });
    });

    // Status filter chips
    document.querySelectorAll('#filterChips .chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('#filterChips .chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            AppState.filters.jobs.status = this.dataset.filter;
            UI.renderJobs();
        });
    });

    // Project filter chips
    document.querySelectorAll('[data-project-filter]').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('[data-project-filter]').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            AppState.filters.projects.filter = this.dataset.filter;
            UI.renderProjects();
        });
    });

    // Add job button
    const addJobBtn = document.getElementById('addJobBtn');
    if (addJobBtn) {
        addJobBtn.addEventListener('click', () => UI.openJobModal());
    }

    // Add project button
    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => UI.openProjectModal());
    }

    // Export dropdown
    const exportDropdown = document.getElementById('exportDropdown');
    const exportMenu = document.getElementById('exportMenu');
    if (exportDropdown && exportMenu) {
        exportDropdown.addEventListener('click', () => {
            exportMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                exportMenu.classList.remove('active');
            }
        });

        exportMenu.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', function() {
                const exportType = this.dataset.export;
                switch(exportType) {
                    case 'xlsx': ExportImport.exportToExcel(); break;
                    case 'docx': ExportImport.exportToWord(); break;
                    case 'csv': ExportImport.exportToCSV(); break;
                    case 'json': ExportImport.exportJSON(); break;
                }
                exportMenu.classList.remove('active');
            });
        });
    }

    // Import jobs
    const importJobsFile = document.getElementById('importJobsFile');
    if (importJobsFile) {
        importJobsFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.name.endsWith('.xlsx')) {
                    ExportImport.importExcel(file);
                } else if (file.name.endsWith('.json')) {
                    ExportImport.importJSON(file);
                }
                this.value = '';
            }
        });
    }

    // Resume upload
    const resumeUpload = document.getElementById('resumeUpload');
    if (resumeUpload) {
        resumeUpload.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 10 * 1024 * 1024) {
                    Utils.showToast('File too large (max 10MB)', 'error');
                    return;
                }
                await Storage.saveResume(file);
                UI.renderResumeStatus();
                Utils.showToast('Resume uploaded successfully', 'success');
                this.value = '';
            }
        });
    }

    // Resume button in header
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', async () => {
            const resume = await Storage.loadResume();
            if (resume) {
                saveAs(resume, resume.name);
                Utils.showToast('Resume downloaded', 'success');
            } else {
                Utils.showToast('No resume uploaded yet', 'info');
            }
        });
    }

    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Toggle between light and dark theme
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            
            if (currentTheme === 'light') {
                // Switch to dark
                html.removeAttribute('data-theme');
                AppState.settings.theme = 'dark';
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                Utils.showToast('Dark theme activated 🌙', 'info');
            } else {
                // Switch to light
                html.setAttribute('data-theme', 'light');
                AppState.settings.theme = 'light';
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                Utils.showToast('Light theme activated ☀️', 'info');
            }
            
            Storage.saveSettings(AppState.settings);
        });
    }

    // Avatar/profile menu toggle
    const avatarBtn = document.getElementById('avatarBtn');
    const profileMenu = document.getElementById('profileMenu');
    if (avatarBtn && profileMenu) {
        const closeProfileMenu = () => {
            profileMenu.classList.remove('active');
            profileMenu.setAttribute('aria-hidden', 'true');
            avatarBtn.setAttribute('aria-expanded', 'false');
        };
        const openProfileMenu = () => {
            // Update mini KPIs
            const k = Analytics.calculateKPIs();
            const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            setText('miniApps', k.totalApps);
            setText('miniInterviews', k.interviews);
            setText('miniOffers', k.offers);
            setText('miniResponse', k.responseRate);

            profileMenu.classList.add('active');
            profileMenu.setAttribute('aria-hidden', 'false');
            avatarBtn.setAttribute('aria-expanded', 'true');
        };

        avatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (profileMenu.classList.contains('active')) {
                closeProfileMenu();
            } else {
                openProfileMenu();
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-profile')) closeProfileMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeProfileMenu();
        });

        // Quick actions
        const qaAddJob = document.getElementById('qaAddJob');
        const qaExportJson = document.getElementById('qaExportJson');
        const qaOpenResume = document.getElementById('qaOpenResume');
        if (qaAddJob) qaAddJob.addEventListener('click', () => { closeProfileMenu(); UI.openJobModal(); });
        if (qaExportJson) qaExportJson.addEventListener('click', () => { closeProfileMenu(); ExportImport.exportJSON(); });
        if (qaOpenResume) qaOpenResume.addEventListener('click', async () => { closeProfileMenu(); UI.openResumeInNewTab(); });
    }

    // Settings
    const glassIntensity = document.getElementById('glassIntensity');
    if (glassIntensity) {
        glassIntensity.addEventListener('input', function(e) {
            AppState.settings.glassIntensity = parseInt(e.target.value);
            const intensity = AppState.settings.glassIntensity;
            
            // Update blur (more dramatic range)
            document.documentElement.style.setProperty('--glass-blur', `${intensity * 3}px`);
            
            // Update opacity inversely (higher blur = lower opacity for stronger effect)
            const opacity = Math.max(0.2, 0.7 - (intensity * 0.05));
            document.documentElement.style.setProperty('--glass-bg', `rgba(21, 27, 63, ${opacity})`);
            
            Storage.saveSettings(AppState.settings);
        });
    }

    const animationToggle = document.getElementById('animationToggle');
    if (animationToggle) {
        animationToggle.addEventListener('change', function(e) {
            AppState.settings.animationsEnabled = e.target.checked;
            document.body.style.setProperty('--transition-normal', e.target.checked ? '0.3s ease' : '0s');
            Storage.saveSettings(AppState.settings);
        });
    }

    const addSocialLinkBtn = document.getElementById('addSocialLinkBtn');
    if (addSocialLinkBtn) {
        addSocialLinkBtn.addEventListener('click', () => UI.addSocialLink());
    }

    const exportAllData = document.getElementById('exportAllData');
    if (exportAllData) {
        exportAllData.addEventListener('click', () => ExportImport.exportJSON());
    }

    const importAllData = document.getElementById('importAllData');
    if (importAllData) {
        importAllData.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                ExportImport.importJSON(file);
                this.value = '';
            }
        });
    }

    const resetAllData = document.getElementById('resetAllData');
    if (resetAllData) {
        resetAllData.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all data? This cannot be undone!')) {
                if (confirm('Really? This will delete EVERYTHING!')) {
                    localStorage.clear();
                    location.reload();
                }
            }
        });
    }

    // Dashboard filters
    const applyFilters = document.getElementById('applyFilters');
    if (applyFilters) {
        applyFilters.addEventListener('click', () => {
            AppState.filters.jobs.dateFrom = document.getElementById('filterDateFrom').value;
            AppState.filters.jobs.dateTo = document.getElementById('filterDateTo').value;
            Analytics.renderKPIs();
            Analytics.renderCharts();
            Utils.showToast('Filters applied', 'info');
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+N: Add new job (when on Jobs tab)
        if (e.ctrlKey && e.key === 'n') {
            const activeTab = document.querySelector('.tab-panel.active');
            if (activeTab && activeTab.id === 'jobs-panel') {
                e.preventDefault();
                UI.openJobModal();
            }
        }
        
        // Escape: Close modals
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal-overlay');
            if (modal) {
                modal.querySelector('.modal-close')?.click();
            }
        }
    });
}

// ========================================
// SEED DATA (for first-time users)
// ========================================
function generateSeedData() {
    if (AppState.jobs.length === 0) {
        const sampleJobs = [
            {
                id: Utils.generateId(),
                company: 'TechCorp',
                role: 'Senior Full Stack Developer',
                appliedDate: '2025-10-15',
                status: 'Interview',
                stage: 'Technical Round',
                source: 'LinkedIn',
                location: 'San Francisco, CA',
                salary: '$120k - $150k',
                contactPerson: 'Jane Smith',
                contactEmail: 'jane@techcorp.com',
                tags: 'React, Node.js, AWS',
                nextActionDate: '2025-11-01',
                notes: 'Great culture, exciting product'
            },
            {
                id: Utils.generateId(),
                company: 'StartupXYZ',
                role: 'Frontend Engineer',
                appliedDate: '2025-10-20',
                status: 'Applied',
                source: 'Company Website',
                location: 'Remote',
                tags: 'Vue.js, TypeScript',
                notes: 'Early stage startup'
            }
        ];
        
        AppState.jobs = sampleJobs;
        Storage.saveJobs(AppState.jobs);
    }

    if (AppState.projects.length === 0) {
        const sampleProjects = [
            {
                id: Utils.generateId(),
                title: 'E-Commerce Platform',
                description: 'Full-stack e-commerce solution with payment integration',
                techStack: 'React, Node.js, MongoDB, Stripe',
                link: 'https://github.com/yourname/ecommerce',
                isJobRelated: false
            }
        ];
        
        AppState.projects = sampleProjects;
        Storage.saveProjects(AppState.projects);
    }
}

// ========================================
// INITIALIZATION
// ========================================
async function init() {
    // Initialize storage
    await Storage.init();
    
    // Load data from storage
    AppState.jobs = Storage.loadJobs();
    AppState.projects = Storage.loadProjects();
    AppState.socialLinks = Storage.loadSocialLinks();
    AppState.settings = Storage.loadSettings();
    
    // Generate seed data if needed (comment this out in production)
    generateSeedData();
    
    // Apply theme
    const savedTheme = AppState.settings.theme || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Sync Settings UI controls to saved values
    const glassInput = document.getElementById('glassIntensity');
    if (glassInput) {
        glassInput.value = String(AppState.settings.glassIntensity ?? 5);
    }
    const animToggle = document.getElementById('animationToggle');
    if (animToggle) {
        animToggle.checked = !!AppState.settings.animationsEnabled;
    }

    // Apply glass settings with enhanced effect
    const intensity = AppState.settings.glassIntensity;
    document.documentElement.style.setProperty('--glass-blur', `${intensity * 3}px`);
    const opacity = Math.max(0.2, 0.7 - (intensity * 0.05));
    document.documentElement.style.setProperty('--glass-bg', `rgba(21, 27, 63, ${opacity})`);
    
    // Apply animations setting
    document.body.style.setProperty('--transition-normal', AppState.settings.animationsEnabled ? '0.3s ease' : '0s');
    
    // Render initial UI
    UI.renderJobs();
    UI.renderProjects();
    UI.renderSocialLinks();
    UI.renderSocialLinksSettings();
    UI.renderResumeStatus();
    Analytics.renderKPIs();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Show welcome message
    setTimeout(() => {
        Utils.showToast('Welcome to DevTracker! 🚀', 'success');
    }, 500);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Make UI functions globally accessible for inline onclick handlers
window.UI = UI;
