// Tech filters and search functionality
export function initTechFilters() {
    const searchInput = document.getElementById('tech-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const techCards = document.querySelectorAll('.tech-card');
    const exportBtn = document.getElementById('export-btn');

    if (!searchInput || !filterButtons.length) return; // Not on tech page

    // Filter by category
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter cards
            techCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        techCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Export to CSV
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }
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
