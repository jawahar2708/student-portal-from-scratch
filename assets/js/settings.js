/* ==========================================================
   SETTINGS - Page Specific JS
   Tabs, Password Form Validation
========================================================== */
document.addEventListener('DOMContentLoaded', function() {

    // 1. TAB SWITCHING
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsPanels = document.querySelectorAll('.settings-panel');

    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            settingsTabs.forEach(t => t.classList.remove('active'));
            settingsPanels.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const panel = document.getElementById(target);
            if (panel) panel.classList.add('active');
        });
    });

    // 2. PASSWORD FORM
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fields = this.querySelectorAll('[required]');
            fields.forEach(field => {
                field.style.borderColor = '';
            });
            this.querySelectorAll('.field-error').forEach(el => el.remove());

            let isValid = true;
            const passwordInputs = this.querySelectorAll('input[type="password"]');
            const newPassword = passwordInputs[1];
            const confirmPassword = passwordInputs[2];

            fields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showFieldError(field, 'This field is required');
                }
            });

            if (newPassword && newPassword.value.length > 0 && newPassword.value.length < 8) {
                isValid = false;
                showFieldError(newPassword, 'Password must be at least 8 characters');
            }

            if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
                isValid = false;
                showFieldError(confirmPassword, 'Passwords do not match');
            }

            if (!isValid) return;

            showToast('Password updated successfully!', 'success');
            this.reset();
        });
    }

    function showFieldError(field, message) {
        field.style.borderColor = 'var(--danger)';
        const error = document.createElement('span');
        error.className = 'field-error';
        error.style.cssText = 'color:var(--danger);font-size:12px;margin-top:4px;display:block;';
        error.textContent = message;
        field.parentElement.appendChild(error);
    }
});
