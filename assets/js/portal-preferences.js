(function(window, document) {
    var THEME_KEY = 'portal-theme';
    var COLLAPSED_KEY = 'portal-sidebar-collapsed';

    // ── Theme read/write ───────────────────────────────────────────────────

    function readThemeFromUrl() {
        try {
            var m = (window.location.search || '').match(/[?&]theme=(dark|light)/);
            if (m) return m[1];
        } catch (e) {}
        return null;
    }

    function readTheme() {
        // URL param takes priority — it is the explicit signal sent on navigation
        // and is the only reliable transport for file:// (where localStorage may
        // be isolated per-directory in Firefox).
        var fromUrl = readThemeFromUrl();
        if (fromUrl === 'dark' || fromUrl === 'light') return fromUrl;
        // Fallback to localStorage (works on HTTP and Chrome file://)
        try {
            var stored = localStorage.getItem(THEME_KEY);
            if (stored === 'dark' || stored === 'light') return stored;
        } catch (e) {}
        return 'light';
    }

    function writeTheme(theme) {
        theme = theme === 'dark' ? 'dark' : 'light';
        // Persist to localStorage
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
        // Keep the URL bar in sync so the current page is bookmarkable and
        // the browser history entry reflects the active theme.
        try {
            var url = new URL(window.location.href);
            if (theme === 'dark') {
                url.searchParams.set('theme', 'dark');
            } else {
                url.searchParams.delete('theme');
            }
            var rel = url.pathname.split('/').pop() + url.search + url.hash;
            var cur = new URL(window.location.href);
            var curRel = cur.pathname.split('/').pop() + cur.search + cur.hash;
            if (rel !== curRel) {
                window.history.replaceState(null, '', rel);
            }
        } catch (e) {}
        return theme;
    }

    // ── DOM helpers ────────────────────────────────────────────────────────

    function applyTheme(theme) {
        theme = theme === 'dark' ? 'dark' : 'light';
        var root = document.documentElement;
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

    // ── Navigation: inject theme into internal link hrefs ──────────────────
    // Used by global.js click handler so the destination page receives the
    // theme via URL param (critical for file:// navigation in Firefox).

    function isInternalLink(href) {
        if (!href || href === '#' || href.charAt(0) === '#') return false;
        if (/^javascript:/i.test(href)) return false;
        if (/^https?:\/\//i.test(href)) {
            try {
                return new URL(href, window.location.href).origin === window.location.origin;
            } catch (e) { return false; }
        }
        // Relative paths and file:// absolute paths to local files are internal
        return true;
    }

    function withThemeInHref(href, theme) {
        if (!isInternalLink(href)) return href;
        try {
            var url = new URL(href, window.location.href);
            if (theme === 'dark') {
                url.searchParams.set('theme', 'dark');
            } else {
                url.searchParams.delete('theme');
            }
            return url.pathname.split('/').pop() + url.search + url.hash;
        } catch (e) {}
        return href;
    }

    // ── Sidebar collapse ───────────────────────────────────────────────────

    function readSidebarCollapsed() {
        try { return localStorage.getItem(COLLAPSED_KEY) === 'true'; } catch (e) {}
        return false;
    }

    function setSidebarCollapsed(collapsed) {
        try { localStorage.setItem(COLLAPSED_KEY, collapsed ? 'true' : 'false'); } catch (e) {}
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

    // ── Init (runs synchronously in <head>) ────────────────────────────────
    // Apply theme immediately to avoid flash, then write it back so both
    // localStorage and URL are always in sync.

    var initialTheme = readTheme();
    applyTheme(initialTheme);
    writeTheme(initialTheme);

    // ── Cross-tab sync ─────────────────────────────────────────────────────

    window.addEventListener('storage', function(e) {
        if (e.key === THEME_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
            applyTheme(e.newValue);
            window.dispatchEvent(new CustomEvent('portal-theme-changed', { detail: e.newValue }));
        }
        if (e.key === COLLAPSED_KEY) {
            applySidebarCollapsedPref();
            window.dispatchEvent(new CustomEvent('portal-sidebar-changed'));
        }
    });

    // ── Public API ─────────────────────────────────────────────────────────

    window.PortalPreferences = {
        getTheme: readTheme,
        getActiveTheme: getActiveTheme,
        setTheme: setTheme,
        applyTheme: applyTheme,
        persistActiveTheme: persistActiveTheme,
        withThemeInHref: withThemeInHref,
        isInternalLink: isInternalLink,
        getSidebarCollapsed: readSidebarCollapsed,
        setSidebarCollapsed: setSidebarCollapsed,
        applySidebarCollapsedPref: applySidebarCollapsedPref,
        clearSidebarCollapsedPref: clearSidebarCollapsedPref
    };
})(window, document);
