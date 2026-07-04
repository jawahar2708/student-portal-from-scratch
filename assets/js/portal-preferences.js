(function(window, document) {
    var THEME_KEY = 'portal-theme';
    var COLLAPSED_KEY = 'portal-sidebar-collapsed';
    var COOKIE_KEY = 'portal-theme';

    function readCookieTheme() {
        var match = document.cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE_KEY + '=(dark|light)(?:;|$)'));
        return match ? match[1] : null;
    }

    function writeCookieTheme(theme) {
        document.cookie = COOKIE_KEY + '=' + theme +
            ';path=/' +
            ';max-age=31536000;SameSite=Lax';
    }

    function readTheme() {
        var stored = null;
        try {
            stored = localStorage.getItem(THEME_KEY);
        } catch (e) {}
        if (stored === 'dark' || stored === 'light') return stored;

        stored = readCookieTheme();
        if (stored === 'dark' || stored === 'light') return stored;

        try {
            stored = sessionStorage.getItem(THEME_KEY);
        } catch (e) {}
        if (stored === 'dark' || stored === 'light') return stored;

        return 'light';
    }

    function writeTheme(theme) {
        theme = theme === 'dark' ? 'dark' : 'light';
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {}
        try {
            sessionStorage.setItem(THEME_KEY, theme);
        } catch (e) {}
        writeCookieTheme(theme);
        return theme;
    }

    function applyTheme(theme) {
        theme = theme === 'dark' ? 'dark' : 'light';
        var root = document.documentElement;
        var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        if (current === theme && root.style.colorScheme === theme) {
            return theme;
        }
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            root.style.backgroundColor = '#0F172A';
        } else {
            root.removeAttribute('data-theme');
            root.style.backgroundColor = '#F4F7FC';
        }
        root.style.colorScheme = theme;
        return theme;
    }

    function getActiveTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function setTheme(theme) {
        theme = writeTheme(theme === 'dark' ? 'dark' : 'light');
        applyTheme(theme);
        window.dispatchEvent(new CustomEvent('portal-theme-changed', { detail: theme }));
        return theme;
    }

    function persistActiveTheme() {
        return setTheme(getActiveTheme());
    }

    function readSidebarCollapsed() {
        try {
            return localStorage.getItem(COLLAPSED_KEY) === 'true';
        } catch (e) {}
        return false;
    }

    function setSidebarCollapsed(collapsed) {
        try {
            localStorage.setItem(COLLAPSED_KEY, collapsed ? 'true' : 'false');
        } catch (e) {}
        applySidebarCollapsedPref();
    }

    function shouldUseCollapsedSidebar() {
        return window.innerWidth > 768 && readSidebarCollapsed();
    }

    function applySidebarCollapsedPref() {
        if (shouldUseCollapsedSidebar()) {
            document.documentElement.setAttribute('data-sidebar-collapsed', 'true');
        } else {
            document.documentElement.removeAttribute('data-sidebar-collapsed');
        }
    }

    function clearSidebarCollapsedPref() {
        document.documentElement.removeAttribute('data-sidebar-collapsed');
    }

    var initialTheme = readTheme();
    if (getActiveTheme() !== initialTheme || document.documentElement.style.colorScheme !== initialTheme) {
        applyTheme(initialTheme);
    }

    window.addEventListener('pageshow', function() {
        var theme = readTheme();
        if (getActiveTheme() !== theme) {
            applyTheme(theme);
        }
        var sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            if (shouldUseCollapsedSidebar()) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
            clearSidebarCollapsedPref();
        } else {
            applySidebarCollapsedPref();
        }
    });

    window.addEventListener('storage', function(e) {
        if (e.key === THEME_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
            applyTheme(e.newValue);
            writeTheme(e.newValue);
            window.dispatchEvent(new CustomEvent('portal-theme-changed', { detail: e.newValue }));
        }
        if (e.key === COLLAPSED_KEY) {
            applySidebarCollapsedPref();
            window.dispatchEvent(new CustomEvent('portal-sidebar-changed'));
        }
    });

    window.PortalPreferences = {
        getTheme: readTheme,
        getActiveTheme: getActiveTheme,
        setTheme: setTheme,
        applyTheme: applyTheme,
        persistActiveTheme: persistActiveTheme,
        getSidebarCollapsed: readSidebarCollapsed,
        setSidebarCollapsed: setSidebarCollapsed,
        applySidebarCollapsedPref: applySidebarCollapsedPref,
        clearSidebarCollapsedPref: clearSidebarCollapsedPref
    };
})(window, document);
