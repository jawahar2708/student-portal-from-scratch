(function(window, document) {
    var THEME_KEY = 'portal-theme';
    var COLLAPSED_KEY = 'portal-sidebar-collapsed';
    var URL_THEME_RE = /[?&]theme=(dark|light)(?:&|$)/;

    function readThemeFromUrl() {
        try {
            var match = (window.location.search || '').match(URL_THEME_RE);
            if (match) return match[1];
        } catch (e) {}
        return null;
    }

    function readTheme() {
        var fromUrl = readThemeFromUrl();
        if (fromUrl === 'dark' || fromUrl === 'light') return fromUrl;

        try {
            var stored = localStorage.getItem(THEME_KEY);
            if (stored === 'dark' || stored === 'light') return stored;
        } catch (e) {}

        return 'light';
    }

    function writeTheme(theme) {
        theme = theme === 'dark' ? 'dark' : 'light';
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {}
        syncThemeUrl(theme);
        return theme;
    }

    function toRelativeHref(url) {
        var path = url.pathname.split('/').pop() || '';
        return path + url.search + url.hash;
    }

    function syncThemeUrl(theme) {
        try {
            var url = new URL(window.location.href);
            if (theme === 'dark') {
                url.searchParams.set('theme', 'dark');
            } else {
                url.searchParams.delete('theme');
            }
            var next = toRelativeHref(url);
            if (next !== toRelativeHref(new URL(window.location.href))) {
                window.history.replaceState(null, '', next);
            }
        } catch (e) {}
    }

    function isInternalPortalLink(href) {
        if (!href || href === '#' || href.charAt(0) === '#') return false;
        if (/^javascript:/i.test(href)) return false;
        if (/^https?:\/\//i.test(href)) {
            try {
                return new URL(href, window.location.href).origin === window.location.origin;
            } catch (e) {
                return false;
            }
        }
        return /\.html?$/i.test(href) || href.indexOf('.') === -1;
    }

    function withThemeInHref(href, theme) {
        if (!isInternalPortalLink(href)) return href;
        try {
            var url = new URL(href, window.location.href);
            if (theme === 'dark') {
                url.searchParams.set('theme', 'dark');
            } else {
                url.searchParams.delete('theme');
            }
            return toRelativeHref(url);
        } catch (e) {
            return href;
        }
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

    function decoratePortalLinks(theme) {
        theme = theme === 'dark' ? 'dark' : 'light';
        document.querySelectorAll('a[href]').forEach(function(link) {
            var href = link.getAttribute('href');
            if (!isInternalPortalLink(href)) return;
            link.setAttribute('href', withThemeInHref(href, theme));
        });
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
    writeTheme(initialTheme);

    window.addEventListener('pageshow', function(e) {
        if (e.persisted) return;
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
        withThemeInHref: withThemeInHref,
        decoratePortalLinks: decoratePortalLinks,
        getSidebarCollapsed: readSidebarCollapsed,
        setSidebarCollapsed: setSidebarCollapsed,
        applySidebarCollapsedPref: applySidebarCollapsedPref,
        clearSidebarCollapsedPref: clearSidebarCollapsedPref
    };
})(window, document);
