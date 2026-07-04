(function (d, w) {
    var THEME_KEY = 'portal-theme';
    var URL_THEME_RE = /[?&]theme=(dark|light)(?:&|$)/;

    function readTheme() {
        var t = null;
        try {
            var match = (w.location.search || '').match(URL_THEME_RE);
            if (match) t = match[1];
        } catch (e) {}
        if (t !== 'dark' && t !== 'light') {
            try { t = w.localStorage.getItem(THEME_KEY); } catch (e) {}
        }
        if (t !== 'dark' && t !== 'light') t = 'light';
        return t;
    }

    var theme = readTheme();
    var root = d.documentElement;
    var isDark = theme === 'dark';

    if (isDark) {
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
        root.style.backgroundColor = '#0F172A';
    } else {
        root.removeAttribute('data-theme');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#F4F7FC';
    }

    var style = d.createElement('style');
    style.id = 'portal-theme-critical';
    style.textContent =
        ':root{--background:#F4F7FC;--card:#FFF;--text-dark:#1F2937;--text-light:#6B7280;--border:#E5E7EB;--primary:#4F46E5;--primary-light:#EEF2FF}' +
        'html[data-theme="dark"]{--background:#0F172A;--card:#1E293B;--text-dark:#F1F5F9;--text-light:#94A3B8;--border:#334155;--primary-light:#312E81;color-scheme:dark}' +
        'html,body{margin:0;min-height:100vh;background-color:var(--background);color:var(--text-dark);color-scheme:light}';
    d.head.appendChild(style);
})(document, window);
