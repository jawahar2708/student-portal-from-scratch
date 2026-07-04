/* ==========================================================
   KNOWLEDGE BASE - Page Specific JS
   Tabs, Report Request Form
========================================================== */
document.addEventListener('DOMContentLoaded', function() {

    // 1. TAB SWITCHING
    const kbTabs = document.querySelectorAll('.kb-tab');
    const kbPanels = document.querySelectorAll('.kb-panel');

    kbTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            kbTabs.forEach(t => t.classList.remove('active'));
            kbPanels.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const panel = document.getElementById(target);
            if (panel) panel.classList.add('active');
        });
    });

    // 2. REPORT REQUEST FORM
    const reportForm = document.getElementById('reportRequestForm');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                showToast('Report access request submitted!', 'success');
                this.reset();
            }
        });
    }
});