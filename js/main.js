// Main application file
import { initAuth } from './modules/auth.js';
import { initCatalog } from './modules/catalog.js';
import { initAccount } from './modules/account.js';
import { 
    formatPrice, 
    formatDate, 
    debounce, 
    showNotification,
    toggleLoading 
} from './modules/utils.js';

class VashAktivApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Initialize modules
        await this.loadUserData();
        this.initEventListeners();
        this.initModules();
        
        console.log('Vash Aktiv app initialized');
    }

    async loadUserData() {
        try {
            const userData = localStorage.getItem('vashAktivUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.updateUIForAuthState(true);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    initEventListeners() {
        // Global event listeners
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
        
        // Search functionality
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.addEventListener('input', debounce(this.handleSearch.bind(this), 300));
        });
    }

    initModules() {
        // Initialize specific page modules
        if (document.querySelector('.catalog-page')) {
            initCatalog();
        }
        
        if (document.querySelector('.account-page')) {
            initAccount();
        }
        
        if (document.querySelector('.auth-form')) {
            initAuth();
        }
    }

    handleGlobalClick(e) {
        // Handle global click events
        const target = e.target;
        
        // Close modals on outside click
        if (target.classList.contains('modal-backdrop')) {
            this.closeModals();
        }
        
        // Handle mobile menu
        if (target.closest('.mobile-menu-btn')) {
            this.toggleMobileMenu();
        }
    }

    handleGlobalKeydown(e) {
        // Close modals on ESC key
        if (e.key === 'Escape') {
            this.closeModals();
        }
    }

    handleSearch(e) {
        const query = e.target.value.trim();
        if (query.length > 2) {
            // Trigger search (implementation depends on page)
            this.triggerSearch(query);
        }
    }

    triggerSearch(query) {
        // This will be implemented in specific page modules
        const event = new CustomEvent('globalSearch', { 
            detail: { query } 
        });
        document.dispatchEvent(event);
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.nav-main');
        nav.classList.toggle('mobile-open');
    }

    closeModals() {
        document.querySelectorAll('.modal-backdrop').forEach(modal => {
            modal.remove();
        });
    }

    updateUIForAuthState(isLoggedIn) {
        const authElements = document.querySelectorAll('[data-auth]');
        authElements.forEach(element => {
            if (isLoggedIn) {
                element.style.display = element.dataset.auth === 'true' ? '' : 'none';
            } else {
                element.style.display = element.dataset.auth === 'false' ? '' : 'none';
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VashAktivApp();
});

// Export for use in other modules
export { VashAktivApp };