/* ============================================================
   DARK MODE PALETTE PICKER
   Injects a palette-picker button next to the dark mode toggle.
   Palette is persisted in localStorage under 'portal-palette'.
   ============================================================ */

(function () {
    var PALETTE_KEY = 'portal-palette';

    var PALETTES = [
        {
            id: 'midnight',
            name: 'Midnight',
            desc: 'Classic deep navy',
            bg: '#0F172A',
            accent: '#6366F1',
        },
        {
            id: 'obsidian',
            name: 'Obsidian',
            desc: 'Pure charcoal black',
            bg: '#111111',
            accent: '#A78BFA',
        },
        {
            id: 'forest',
            name: 'Forest',
            desc: 'Dark emerald green',
            bg: '#0A1A12',
            accent: '#34D399',
        },
        {
            id: 'crimson',
            name: 'Crimson',
            desc: 'Deep rose & red',
            bg: '#150A0A',
            accent: '#FB7185',
        },
        {
            id: 'aurora',
            name: 'Aurora',
            desc: 'Vivid deep violet',
            bg: '#0D0A1A',
            accent: '#C084FC',
        },
    ];

    /* ── Persistence ─────────────────────────────────────── */

    function readPalette() {
        try {
            var v = localStorage.getItem(PALETTE_KEY);
            if (PALETTES.some(function (p) { return p.id === v; })) return v;
        } catch (e) {}
        return 'midnight';
    }

    function writePalette(id) {
        try { localStorage.setItem(PALETTE_KEY, id); } catch (e) {}
        // Also encode in URL so file:// navigation preserves it
        try {
            var url = new URL(window.location.href);
            if (id && id !== 'midnight') {
                url.searchParams.set('palette', id);
            } else {
                url.searchParams.delete('palette');
            }
            var rel = url.pathname.split('/').pop() + url.search + url.hash;
            var cur = new URL(window.location.href);
            var curRel = cur.pathname.split('/').pop() + cur.search + cur.hash;
            if (rel !== curRel) window.history.replaceState(null, '', rel);
        } catch (e) {}
    }

    function readPaletteFromUrl() {
        try {
            var m = (window.location.search || '').match(/[?&]palette=([a-z]+)/);
            if (m && PALETTES.some(function (p) { return p.id === m[1]; })) return m[1];
        } catch (e) {}
        return null;
    }

    /* ── Apply ───────────────────────────────────────────── */

    function applyPalette(id) {
        var root = document.documentElement;
        if (id && id !== 'midnight') {
            root.setAttribute('data-palette', id);
        } else {
            root.removeAttribute('data-palette');
        }
        // Sync the inline background immediately (avoids flash on navigation)
        var palette = PALETTES.find(function (p) { return p.id === id; });
        if (palette && root.getAttribute('data-theme') === 'dark') {
            root.style.backgroundColor = palette.bg;
        }
    }

    /* ── DOM: build the picker panel ─────────────────────── */

    function buildPicker(currentPaletteId) {
        // Wrapper (provides positioning context)
        var wrap = document.createElement('div');
        wrap.className = 'palette-picker-wrap';
        wrap.id = 'palettePicker';

        // Trigger button
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'palette-picker-btn';
        btn.id = 'palettePickerBtn';
        btn.title = 'Choose dark palette';
        btn.setAttribute('aria-label', 'Choose dark palette');
        btn.innerHTML = '<i class="fa-solid fa-palette"></i>';

        // Flyout panel
        var panel = document.createElement('div');
        panel.className = 'palette-panel';
        panel.id = 'palettePanelFlyout';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Dark mode palette');

        var heading = document.createElement('h4');
        heading.textContent = 'Dark Palette';

        var swatchList = document.createElement('div');
        swatchList.className = 'palette-swatches';

        PALETTES.forEach(function (palette) {
            var swatch = document.createElement('button');
            swatch.type = 'button';
            swatch.className = 'palette-swatch' + (palette.id === currentPaletteId ? ' selected' : '');
            swatch.dataset.paletteId = palette.id;
            swatch.setAttribute('aria-label', palette.name + ' palette');

            var dot = document.createElement('span');
            dot.className = 'swatch-dot';
            dot.style.background = 'linear-gradient(135deg, ' + palette.bg + ' 40%, ' + palette.accent + ')';

            var info = document.createElement('span');
            info.className = 'swatch-info';
            info.innerHTML =
                '<span class="swatch-name">' + palette.name + '</span>' +
                '<span class="swatch-desc">' + palette.desc + '</span>';

            swatch.appendChild(dot);
            swatch.appendChild(info);
            swatchList.appendChild(swatch);

            swatch.addEventListener('click', function () {
                selectPalette(palette.id, wrap, panel);
            });
        });

        panel.appendChild(heading);
        panel.appendChild(swatchList);

        // Toggle open/close
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = panel.classList.contains('open');
            panel.classList.toggle('open', !isOpen);
            btn.classList.toggle('active', !isOpen);
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) {
                panel.classList.remove('open');
                btn.classList.remove('active');
            }
        });

        wrap.appendChild(btn);
        wrap.appendChild(panel);
        return wrap;
    }

    function selectPalette(id, wrap, panel) {
        applyPalette(id);
        writePalette(id);

        // Update selected state on swatches
        wrap.querySelectorAll('.palette-swatch').forEach(function (s) {
            s.classList.toggle('selected', s.dataset.paletteId === id);
        });

        // Auto-close after pick
        setTimeout(function () {
            panel.classList.remove('open');
            document.getElementById('palettePickerBtn').classList.remove('active');
        }, 180);

        // Tell global.js the theme changed (so dark-mode toggle icon stays in sync)
        window.dispatchEvent(new CustomEvent('portal-palette-changed', { detail: id }));
    }

    /* ── Init ────────────────────────────────────────────── */

    function init() {
        // Determine palette (URL param first for file:// compat, then localStorage)
        var fromUrl = readPaletteFromUrl();
        var activePalette = fromUrl || readPalette();
        writePalette(activePalette);
        applyPalette(activePalette);

        // Inject picker into nav-right (next to dark mode toggle)
        var navRight = document.querySelector('.nav-right');
        if (!navRight || document.getElementById('palettePicker')) return;

        var picker = buildPicker(activePalette);

        // Insert before the dark mode toggle wrapper (first child of nav-right)
        var togglesDiv = navRight.querySelector('.portal-toggles');
        if (togglesDiv) {
            navRight.insertBefore(picker, togglesDiv);
        } else {
            navRight.insertBefore(picker, navRight.firstChild);
        }

        // Re-apply palette when theme changes (light → dark transition)
        window.addEventListener('portal-theme-changed', function (e) {
            if (e.detail === 'dark') {
                applyPalette(readPalette());
            } else {
                document.documentElement.removeAttribute('data-palette');
            }
        });

        // Patch click handler so palette param is forwarded on navigation
        // (mirrors what global.js does for ?theme=)
        document.addEventListener('click', function (e) {
            if (document.documentElement.getAttribute('data-theme') !== 'dark') return;
            var link = e.target.closest('a[href]');
            if (!link) return;
            var href = link.getAttribute('href');
            if (!href || href === '#' || href.charAt(0) === '#') return;
            if (/^javascript:/i.test(href)) return;
            var pal = readPalette();
            try {
                var url = new URL(href, window.location.href);
                if (pal && pal !== 'midnight') {
                    url.searchParams.set('palette', pal);
                } else {
                    url.searchParams.delete('palette');
                }
                var rel = url.pathname.split('/').pop() + url.search + url.hash;
                link.setAttribute('href', rel);
            } catch (ex) {}
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
