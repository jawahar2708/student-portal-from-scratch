/* ========================================
   STUDENT PORTAL – GLOBAL JS
   Shared interactive behavior for all pages
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const prefs = window.PortalPreferences;
    const sidebar = document.querySelector('.sidebar');

    function isSidebarCollapsibleViewport() {
        return window.innerWidth > 768;
    }

    function isResponsiveIconOnly() {
        return isSidebarCollapsibleViewport() && window.innerWidth <= 992;
    }

    function isSidebarCollapsed() {
        return sidebar && sidebar.classList.contains('collapsed');
    }

    function isSidebarIconOnly() {
        if (!sidebar || !isSidebarCollapsibleViewport()) return false;
        if (isSidebarCollapsed()) return true;
        if (isResponsiveIconOnly()) return true;
        return false;
    }

    function setSidebarCollapsed(collapsed) {
        if (!sidebar || !isSidebarCollapsibleViewport()) return;
        sidebar.classList.toggle('collapsed', collapsed);
        if (prefs) prefs.setSidebarCollapsed(collapsed);
        if (collapsed) {
            closeAllSubmenuFlyouts();
        }
        syncSidebarShrinkToggle();
    }

    function restoreSidebarCollapsed() {
        if (!sidebar || !isSidebarCollapsibleViewport()) return;
        if (prefs && prefs.getSidebarCollapsed()) {
            sidebar.classList.add('collapsed');
        }
        if (prefs) prefs.clearSidebarCollapsedPref();
    }

    function persistThemeForNavigation(link) {
        if (!prefs) return;
        var theme = prefs.getActiveTheme();
        prefs.setTheme(theme);
        if (link && prefs.withThemeInHref) {
            var href = link.getAttribute('href');
            if (href) {
                link.setAttribute('href', prefs.withThemeInHref(href, theme));
            }
        }
    }

    function syncSidebarShrinkToggle() {
        const sidebarShrinkToggle = document.getElementById('sidebarShrinkToggle');
        if (!sidebarShrinkToggle) return;
        const iconOnly = isSidebarIconOnly();
        sidebarShrinkToggle.classList.toggle('active', iconOnly);
        sidebarShrinkToggle.innerHTML = iconOnly
            ? '<i class="fa-solid fa-angles-right"></i>'
            : '<i class="fa-solid fa-angles-left"></i>';
        sidebarShrinkToggle.title = iconOnly ? 'Expand sidebar' : 'Collapse sidebar';
        sidebarShrinkToggle.setAttribute('aria-label', iconOnly ? 'Expand sidebar' : 'Collapse sidebar');
    }

    function syncDarkModeToggle() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle) return;
        const isDark = prefs && prefs.getActiveTheme() === 'dark';
        darkModeToggle.classList.toggle('active', isDark);
        darkModeToggle.innerHTML = isDark
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
        darkModeToggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }

    function closeAllSubmenuFlyouts() {
        document.querySelectorAll('.has-submenu.flyout-open').forEach(function(item) {
            item.classList.remove('flyout-open');
        });
    }

    function positionSubmenuFlyout(parent) {
        const submenu = parent.querySelector('.submenu');
        const trigger = parent.querySelector('.submenu-toggle');
        if (!submenu || !trigger) return;

        submenu.style.top = '';
        submenu.style.left = '';
        const rect = trigger.getBoundingClientRect();
        const submenuHeight = submenu.offsetHeight || 120;
        const top = Math.min(rect.top, window.innerHeight - submenuHeight - 12);
        submenu.style.top = Math.max(12, top) + 'px';
        submenu.style.left = (rect.right + 8) + 'px';
    }

    restoreSidebarCollapsed();

    if (prefs && prefs.decoratePortalLinks) {
        prefs.decoratePortalLinks(prefs.getActiveTheme());
    }

    window.addEventListener('portal-theme-changed', function(e) {
        syncDarkModeToggle();
        if (prefs && prefs.decoratePortalLinks) {
            prefs.decoratePortalLinks(e.detail || prefs.getActiveTheme());
        }
    });

    window.addEventListener('portal-sidebar-changed', function() {
        if (!sidebar || !isSidebarCollapsibleViewport()) return;
        if (prefs && prefs.getSidebarCollapsed()) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
        closeAllSubmenuFlyouts();
        syncSidebarShrinkToggle();
    });

    window.addEventListener('resize', function() {
        if (!isSidebarCollapsibleViewport() && sidebar) {
            sidebar.classList.remove('collapsed');
            closeAllSubmenuFlyouts();
            if (prefs) prefs.clearSidebarCollapsedPref();
        } else {
            restoreSidebarCollapsed();
            if (prefs) prefs.applySidebarCollapsedPref();
            document.querySelectorAll('.has-submenu.flyout-open').forEach(positionSubmenuFlyout);
        }
        syncSidebarShrinkToggle();
    });

    // Sidebar collapse toggle (top of left sidebar, below logo)
    if (sidebar && !document.getElementById('sidebarShrinkToggle')) {
        const collapseWrap = document.createElement('div');
        collapseWrap.className = 'sidebar-collapse-wrap';
        collapseWrap.innerHTML =
            '<button type="button" class="sidebar-collapse-btn" id="sidebarShrinkToggle" title="Collapse sidebar" aria-label="Collapse sidebar">' +
            '<i class="fa-solid fa-angles-left"></i></button>';

        const sidebarLogo = sidebar.querySelector('.sidebar-logo');
        if (sidebarLogo) {
            sidebarLogo.insertAdjacentElement('afterend', collapseWrap);
        } else {
            sidebar.insertBefore(collapseWrap, sidebar.firstChild);
        }

        document.getElementById('sidebarShrinkToggle').addEventListener('click', function() {
            setSidebarCollapsed(!isSidebarIconOnly());
        });

        syncSidebarShrinkToggle();
    }

    // Dark mode toggle (top navbar)
    const navRight = document.querySelector('.nav-right');
    if (navRight && !document.getElementById('darkModeToggle')) {
        const toggles = document.createElement('div');
        toggles.className = 'portal-toggles';
        toggles.innerHTML =
            '<button type="button" class="portal-toggle-btn" id="darkModeToggle" title="Toggle dark mode" aria-label="Toggle dark mode">' +
            '<i class="fa-solid fa-moon"></i></button>';
        navRight.insertBefore(toggles, navRight.firstChild);

        document.getElementById('darkModeToggle').addEventListener('click', function() {
            if (!prefs) return;
            const nextTheme = prefs.getActiveTheme() === 'dark' ? 'light' : 'dark';
            prefs.setTheme(nextTheme);
            syncDarkModeToggle();
        });

        syncDarkModeToggle();
    }

    // Persist theme before navigating to another page
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href]');
        if (!link || !prefs) return;
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.charAt(0) === '#') return;
        if (/^javascript:/i.test(href)) return;
        if (/^https?:\/\//i.test(href)) {
            try {
                const target = new URL(href, window.location.href);
                if (target.origin !== window.location.origin) return;
            } catch (err) {
                return;
            }
        }
        persistThemeForNavigation(link);
        if (prefs.getSidebarCollapsed()) {
            prefs.applySidebarCollapsedPref();
        }
    }, true);

    document.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        const link = e.target.closest('a[href]');
        if (!link || !prefs) return;
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.charAt(0) === '#') return;
        if (/^javascript:/i.test(href)) return;
        persistThemeForNavigation(link);
        if (prefs.getSidebarCollapsed()) {
            prefs.applySidebarCollapsedPref();
        }
    }, true);

    window.addEventListener('beforeunload', function() {
        persistThemeForNavigation();
        if (prefs && prefs.getSidebarCollapsed()) {
            prefs.applySidebarCollapsedPref();
        }
    });

    // Mobile drawer / desktop collapse via menu button
    const menuButton = document.querySelector('.menu-btn');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    if (menuButton && sidebar) {
        menuButton.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            } else {
                setSidebarCollapsed(!isSidebarIconOnly());
            }
        });
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            closeAllSubmenuFlyouts();
        });
    }

    // Submenu toggle (expanded sidebar + collapsed flyout)
    document.querySelectorAll('.submenu-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const parent = this.closest('.has-submenu');
            if (!parent) return;

            if (isSidebarIconOnly()) {
                const willOpen = !parent.classList.contains('flyout-open');
                closeAllSubmenuFlyouts();
                if (willOpen) {
                    parent.classList.add('flyout-open');
                    requestAnimationFrame(function() {
                        positionSubmenuFlyout(parent);
                    });
                }
            } else {
                parent.classList.toggle('open');
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (!isSidebarIconOnly()) return;
        if (!e.target.closest('.has-submenu')) {
            closeAllSubmenuFlyouts();
        }
    });

    // Dynamic navbar highlighting
    let pageName = window.location.pathname.split('/').pop() || 'dashboard.html';
    if (!pageName || pageName === '') pageName = 'dashboard.html';

    document.querySelectorAll('.sidebar-menu .menu-item').forEach(function(item) {
        item.classList.remove('active');
    });
    document.querySelectorAll('.submenu li').forEach(function(item) {
        item.classList.remove('active');
    });

    document.querySelectorAll('.sidebar-menu a').forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === pageName) {
            const submenuLi = link.closest('.submenu li');
            if (submenuLi) {
                submenuLi.classList.add('active');
                const parentSubmenu = link.closest('.has-submenu');
                if (parentSubmenu && !isSidebarIconOnly()) {
                    parentSubmenu.classList.add('open');
                }
            } else {
                const menuItem = link.closest('.menu-item');
                if (menuItem) menuItem.classList.add('active');
            }
        }
    });

    // Notification dropdown
    const notifContainer = document.querySelector('.notification-container');
    const notifDropdown = document.querySelector('.notification-dropdown');
    if (notifContainer && notifDropdown) {
        notifContainer.addEventListener('click', function(e) {
            e.stopPropagation();
            notifDropdown.classList.toggle('show');
        });
        document.addEventListener('click', function() {
            notifDropdown.classList.remove('show');
        });
    }

    // Toast system
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    window.showToast = function(message, type) {
        type = type || 'success';
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation' };
        toast.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.success) + '"></i> ' + message;
        toastContainer.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    };

    // Form validation
    window.validateForm = function(form) {
        let isValid = true;
        form.querySelectorAll('.field-error').forEach(function(el) { el.remove(); });
        form.querySelectorAll('[required]').forEach(function(field) {
            field.style.borderColor = '';
            if (!field.value.trim()) {
                isValid = false;
                const error = document.createElement('span');
                error.className = 'field-error';
                error.style.cssText = 'color:var(--danger);font-size:12px;margin-top:4px;display:block;';
                error.textContent = 'This field is required';
                field.parentElement.appendChild(error);
                field.style.borderColor = 'var(--danger)';
            }
            if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                isValid = false;
                const error = document.createElement('span');
                error.className = 'field-error';
                error.style.cssText = 'color:var(--danger);font-size:12px;margin-top:4px;display:block;';
                error.textContent = 'Please enter a valid email';
                field.parentElement.appendChild(error);
                field.style.borderColor = 'var(--danger)';
            }
        });
        return isValid;
    };
});
