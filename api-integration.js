// ========================================
// API SERVICE - Backend Integration
// ========================================
// Add this to your app.js file or create a separate api.js file

const API_BASE_URL = 'http://localhost:5000/api';

// API Service
const API = {
    // Get auth token from localStorage
    getToken: function() {
        return localStorage.getItem('devtracker_token');
    },

    // Set auth token
    setToken: function(token) {
        localStorage.setItem('devtracker_token', token);
    },

    // Remove auth token
    removeToken: function() {
        localStorage.removeItem('devtracker_token');
    },

    // Check if user is logged in
    isAuthenticated: function() {
        return !!this.getToken();
    },

    // Make authenticated request
    request: async function(endpoint, options = {}) {
        const token = this.getToken();
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle authentication errors
                if (response.status === 401) {
                    this.removeToken();
                    window.location.href = 'login.html'; // Redirect to login
                    throw new Error('Session expired. Please login again.');
                }
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // ========================================
    // AUTH ENDPOINTS
    // ========================================
    auth: {
        register: async function(name, email, password) {
            const data = await API.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });
            
            if (data.success && data.token) {
                API.setToken(data.token);
            }
            
            return data;
        },

        login: async function(email, password) {
            const data = await API.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            if (data.success && data.token) {
                API.setToken(data.token);
            }
            
            return data;
        },

        logout: function() {
            API.removeToken();
            window.location.href = 'login.html';
        },

        getCurrentUser: async function() {
            return await API.request('/auth/me');
        }
    },

    // ========================================
    // JOB ENDPOINTS
    // ========================================
    jobs: {
        getAll: async function() {
            const response = await API.request('/jobs');
            return response.data || [];
        },

        getOne: async function(id) {
            const response = await API.request(`/jobs/${id}`);
            return response.data;
        },

        create: async function(jobData) {
            const response = await API.request('/jobs', {
                method: 'POST',
                body: JSON.stringify(jobData)
            });
            return response.data;
        },

        update: async function(id, jobData) {
            const response = await API.request(`/jobs/${id}`, {
                method: 'PUT',
                body: JSON.stringify(jobData)
            });
            return response.data;
        },

        delete: async function(id) {
            const response = await API.request(`/jobs/${id}`, {
                method: 'DELETE'
            });
            return response.data;
        },

        bulkCreate: async function(jobs) {
            const response = await API.request('/jobs/bulk', {
                method: 'POST',
                body: JSON.stringify({ jobs })
            });
            return response.data;
        }
    },

    // ========================================
    // PROJECT ENDPOINTS
    // ========================================
    projects: {
        getAll: async function() {
            const response = await API.request('/projects');
            return response.data || [];
        },

        create: async function(projectData) {
            const response = await API.request('/projects', {
                method: 'POST',
                body: JSON.stringify(projectData)
            });
            return response.data;
        },

        update: async function(id, projectData) {
            const response = await API.request(`/projects/${id}`, {
                method: 'PUT',
                body: JSON.stringify(projectData)
            });
            return response.data;
        },

        delete: async function(id) {
            const response = await API.request(`/projects/${id}`, {
                method: 'DELETE'
            });
            return response.data;
        }
    },

    // ========================================
    // SETTINGS ENDPOINTS
    // ========================================
    settings: {
        get: async function() {
            const response = await API.request('/settings');
            return response.data;
        },

        update: async function(settingsData) {
            const response = await API.request('/settings', {
                method: 'PUT',
                body: JSON.stringify(settingsData)
            });
            return response.data;
        }
    }
};

// ========================================
// UPDATED STORAGE LAYER (Use API instead of localStorage)
// ========================================
const StorageNew = {
    // Jobs
    saveJobs: async function(jobs) {
        // This will be handled by individual create/update/delete operations
        console.log('Jobs are now saved to backend automatically');
    },
    
    loadJobs: async function() {
        try {
            if (!API.isAuthenticated()) {
                return [];
            }
            return await API.jobs.getAll();
        } catch (error) {
            console.error('Error loading jobs:', error);
            return [];
        }
    },

    // Projects
    saveProjects: async function(projects) {
        console.log('Projects are now saved to backend automatically');
    },
    
    loadProjects: async function() {
        try {
            if (!API.isAuthenticated()) {
                return [];
            }
            return await API.projects.getAll();
        } catch (error) {
            console.error('Error loading projects:', error);
            return [];
        }
    },

    // Settings
    saveSettings: async function(settings) {
        try {
            if (!API.isAuthenticated()) {
                localStorage.setItem('devtracker_settings', JSON.stringify(settings));
                return;
            }
            await API.settings.update(settings);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    },
    
    loadSettings: async function() {
        try {
            if (!API.isAuthenticated()) {
                const data = localStorage.getItem('devtracker_settings');
                return data ? JSON.parse(data) : AppState.settings;
            }
            const settings = await API.settings.get();
            return {
                glassIntensity: settings.glassIntensity,
                animationsEnabled: settings.animationsEnabled,
                theme: settings.theme
            };
        } catch (error) {
            console.error('Error loading settings:', error);
            return AppState.settings;
        }
    },

    // Social Links (part of settings)
    saveSocialLinks: async function(links) {
        try {
            if (!API.isAuthenticated()) {
                localStorage.setItem('devtracker_social', JSON.stringify(links));
                return;
            }
            await API.settings.update({ socialLinks: links });
        } catch (error) {
            console.error('Error saving social links:', error);
        }
    },
    
    loadSocialLinks: async function() {
        try {
            if (!API.isAuthenticated()) {
                const data = localStorage.getItem('devtracker_social');
                return data ? JSON.parse(data) : DEFAULT_SOCIAL_LINKS;
            }
            const settings = await API.settings.get();
            return settings.socialLinks || DEFAULT_SOCIAL_LINKS;
        } catch (error) {
            console.error('Error loading social links:', error);
            return DEFAULT_SOCIAL_LINKS;
        }
    }
};

// ========================================
// MIGRATION HELPER
// ========================================
const MigrateData = {
    // Migrate existing localStorage data to backend
    migrateToBackend: async function() {
        if (!API.isAuthenticated()) {
            console.log('Please login first to migrate data');
            return;
        }

        try {
            // Get existing localStorage data
            const localJobs = JSON.parse(localStorage.getItem('devtracker_jobs') || '[]');
            const localProjects = JSON.parse(localStorage.getItem('devtracker_projects') || '[]');
            const localSettings = JSON.parse(localStorage.getItem('devtracker_settings') || '{}');
            const localSocial = JSON.parse(localStorage.getItem('devtracker_social') || '[]');

            console.log(`Migrating ${localJobs.length} jobs...`);
            console.log(`Migrating ${localProjects.length} projects...`);

            // Migrate jobs
            if (localJobs.length > 0) {
                await API.jobs.bulkCreate(localJobs);
                console.log('✅ Jobs migrated successfully');
            }

            // Migrate projects
            for (const project of localProjects) {
                await API.projects.create(project);
            }
            if (localProjects.length > 0) {
                console.log('✅ Projects migrated successfully');
            }

            // Migrate settings and social links
            await API.settings.update({
                ...localSettings,
                socialLinks: localSocial
            });
            console.log('✅ Settings migrated successfully');

            console.log('🎉 Migration complete! Your data is now in the backend.');
            
            // Optional: Clear localStorage after successful migration
            const clearLocal = confirm('Migration successful! Clear local storage?');
            if (clearLocal) {
                localStorage.removeItem('devtracker_jobs');
                localStorage.removeItem('devtracker_projects');
                localStorage.removeItem('devtracker_settings');
                localStorage.removeItem('devtracker_social');
                console.log('✅ Local storage cleared');
            }

        } catch (error) {
            console.error('Migration error:', error);
            alert('Error migrating data: ' + error.message);
        }
    }
};

// ========================================
// USAGE EXAMPLE
// ========================================

/*
// To use the new API in your existing code:

// 1. Replace Storage.saveJobs() calls with:
async function addNewJob(jobData) {
    const newJob = await API.jobs.create(jobData);
    AppState.jobs.unshift(newJob);
    UI.renderJobs();
}

// 2. Replace Storage.loadJobs() with:
async function loadJobsFromBackend() {
    AppState.jobs = await StorageNew.loadJobs();
    UI.renderJobs();
}

// 3. For updates:
async function updateJob(jobId, jobData) {
    const updatedJob = await API.jobs.update(jobId, jobData);
    const index = AppState.jobs.findIndex(j => j._id === jobId);
    AppState.jobs[index] = updatedJob;
    UI.renderJobs();
}

// 4. For deletes:
async function deleteJob(jobId) {
    await API.jobs.delete(jobId);
    AppState.jobs = AppState.jobs.filter(j => j._id !== jobId);
    UI.renderJobs();
}
*/
