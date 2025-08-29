// Tech filters and search functionality
export function initTechFilters() {
    const searchInput = document.getElementById('tech-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const techCards = document.querySelectorAll('.tech-card');
    const exportBtn = document.getElementById('export-btn');
    let currentFilter = 'all';
    let currentSearch = '';

    if (!searchInput || !filterButtons.length) return; // Not on tech page

    // Add keyboard shortcut for search
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // Initialize animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    techCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);

    // Função para filtrar cards
    function filterCards() {
        techCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());
            
            const matchesSearch = currentSearch === '' || 
                title.includes(currentSearch) || 
                content.includes(currentSearch) ||
                tags.some(tag => tag.includes(currentSearch));
                
            const matchesFilter = currentFilter === 'all' || card.dataset.category === currentFilter;
            
            card.style.display = matchesSearch && matchesFilter ? '' : 'none';
            
            if (matchesSearch && matchesFilter) {
                card.style.animation = 'fadeIn 0.5s ease forwards';
            }
        });
    }

    // Filter by category
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentFilter = button.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterCards();
        });
    });

    // Search functionality with debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearch = e.target.value.toLowerCase();
            filterCards();
        }, 300);
    });

    // Export to CSV functionality
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const visibleCards = Array.from(techCards).filter(card => card.style.display !== 'none');
            const csvContent = [
                ['Tecnologia', 'Descrição', 'Categoria', 'Tags'].join(','),
                ...visibleCards.map(card => {
                    const title = card.querySelector('h3').textContent;
                    const description = card.querySelector('p').textContent;
                    const category = card.dataset.category;
                    const tags = Array.from(card.querySelectorAll('.tech-tag'))
                        .map(tag => tag.textContent)
                        .join(';');
                    return [title, description, category, tags].map(text => `"${text}"`).join(',');
                })
            ].join('\\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'tecnologias.csv';
            link.click();
        });
    }

    // Feedback visual ao pesquisar
    searchInput.addEventListener('focus', () => {
        searchInput.parentElement.classList.add('searching');
    });

    searchInput.addEventListener('blur', () => {
        if (!searchInput.value) {
            searchInput.parentElement.classList.remove('searching');
        }
    });
}

function exportToCSV() {
    const techCards = document.querySelectorAll('.tech-card:not([style*="display: none"])');
    let csv = 'Tecnologia,Categoria,Descrição\n';

    techCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        const category = card.dataset.category;
        const description = card.querySelector('p').textContent;

        csv += `"${title}","${category}","${description}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'tecnologias-web.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
