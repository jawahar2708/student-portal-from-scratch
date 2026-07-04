/* ==========================================================
   SUPPORT CENTER - Page Specific JS
   Tabs, Modal, FAQ, Form Validation
========================================================== */
document.addEventListener('DOMContentLoaded', function() {

    // 1. TAB SWITCHING
    const supportTabs = document.querySelectorAll('.support-tab');
    const supportPanels = document.querySelectorAll('.support-panel');

    supportTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            supportTabs.forEach(t => t.classList.remove('active'));
            supportPanels.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const panel = document.getElementById(target);
            if (panel) panel.classList.add('active');
        });
    });

    // 2. RAISE TICKET MODAL
    const raiseBtn = document.getElementById('raiseTicketBtn');
    const ticketModal = document.getElementById('ticketModal');
    const closeModal = document.getElementById('closeTicketModal');
    const cancelTicket = document.getElementById('cancelTicket');

    function openModal() {
        if (ticketModal) ticketModal.classList.add('show');
    }

    function closeModalFn() {
        if (ticketModal) ticketModal.classList.remove('show');
    }

    if (raiseBtn) raiseBtn.addEventListener('click', openModal);
    if (closeModal) closeModal.addEventListener('click', closeModalFn);
    if (cancelTicket) cancelTicket.addEventListener('click', closeModalFn);

    if (ticketModal) {
        ticketModal.addEventListener('click', function(e) {
            if (e.target === ticketModal) closeModalFn();
        });
    }

    // 3. TICKET FORM SUBMISSION
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                showToast('Ticket submitted successfully!', 'success');
                closeModalFn();
                this.reset();
            }
        });
    }

    // 4. FAQ ACCORDION
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const parent = this.closest('.faq-item');
            const isOpen = parent.classList.contains('open');
            // Close all
            document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));
            // Toggle clicked
            if (!isOpen) parent.classList.add('open');
        });
    });

    // 5. SEND MESSAGE BUTTONS
    document.querySelectorAll('.faculty-card .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showToast('Message feature coming soon!', 'warning');
        });
    });
});