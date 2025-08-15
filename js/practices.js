// Accordion and checklist functionality
export function initPractices() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    const checklistItems = document.querySelectorAll('.checklist-item input');
    const progressBar = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    if (!accordionItems.length) return; // Not on practices page

    // Load saved progress
    const savedProgress = JSON.parse(localStorage.getItem('practicesProgress') || '{}');
    
    // Initialize checkboxes from saved state
    checklistItems.forEach(checkbox => {
        const id = `${checkbox.name}-${checkbox.value}`;
        checkbox.checked = savedProgress[id] || false;
    });

    // Accordion functionality
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // Close all other items
            accordionItems.forEach(other => {
                if (other !== item) {
                    other.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                    other.querySelector('.accordion-content').style.maxHeight = '0';
                }
            });

            // Toggle current item
            header.setAttribute('aria-expanded', !isExpanded);
            content.style.maxHeight = !isExpanded ? `${content.scrollHeight}px` : '0';
        });
    });

    // Checklist functionality
    checklistItems.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Save progress
            const id = `${checkbox.name}-${checkbox.value}`;
            savedProgress[id] = checkbox.checked;
            localStorage.setItem('practicesProgress', JSON.stringify(savedProgress));

            // Update progress bar
            updateProgress();
        });
    });

    // Initial progress update
    updateProgress();

    function updateProgress() {
        const total = checklistItems.length;
        const checked = Array.from(checklistItems).filter(item => item.checked).length;
        const percentage = Math.round((checked / total) * 100);

        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% completo`;
    }
}
