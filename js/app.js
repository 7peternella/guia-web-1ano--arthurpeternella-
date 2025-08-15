// Import modules
import { initTechFilters } from './tech-filters.js';
import { initPractices } from './practices.js';
import { initQuiz } from './quiz.js';

// Theme management
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Load saved theme or use system preference
const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);

// Update theme icon
const updateThemeIcon = (theme) => {
    const iconPath = theme === 'dark' 
        ? 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
        : 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z';
    
    themeToggle.querySelector('.theme-icon').innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"></path>
    `;
};

updateThemeIcon(currentTheme);

// Theme toggle handler
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // "/" for search
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const searchInput = document.getElementById('tech-search');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Alt+M for menu toggle
    if (e.key === 'm' && e.altKey) {
        e.preventDefault();
        document.querySelector('.nav-links').classList.toggle('show');
    }
    
    // Home for scroll to top
    if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Initialize modules
    initTechFilters();
    initPractices();
    initQuiz();
});
