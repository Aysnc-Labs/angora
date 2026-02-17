import { useState, useEffect, useMemo } from 'preact/hooks';

interface NavItem {
  href: string;
  label: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  external?: boolean;
}

interface Props {
  groups: NavGroup[];
  currentPath: string;
  darkMode?: boolean;
}

const ExternalIcon = () => (
  <svg
    class="ds-nav-external-icon"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ChevronIcon = () => (
  <svg
    class="ds-nav-chevron"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const ThemeIcon = ({ dark }: { dark: boolean }) => (
  <span
    style={{
      display: 'inline-flex',
      width: '14px',
      height: '14px',
      transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
      transform: dark ? 'rotate(360deg)' : 'rotate(0deg)',
    }}
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      style={{
        position: 'absolute',
        transition: 'opacity 300ms ease, transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: dark ? 0 : 1,
        transform: dark ? 'scale(0.5)' : 'scale(1)',
      }}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      style={{
        position: 'absolute',
        transition: 'opacity 300ms ease, transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: dark ? 1 : 0,
        transform: dark ? 'scale(1)' : 'scale(0.5)',
      }}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </span>
);

const THEME_KEY = 'angora-ds-theme';

export default function Sidebar({ groups, currentPath, darkMode = false }: Props) {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  const [query, setQuery] = useState('');
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const group of groups) {
      if (group.items.some((item) => normalizePath(item.href) === currentPath)) {
        initial.add(group.title);
      }
    }
    return initial;
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups.map((g) => ({ ...g, items: g.items }));
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((item) => item.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [query, groups]);

  const isSearching = query.trim().length > 0;

  function toggleGroup(title: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  function isOpen(title: string) {
    if (isSearching) return true;
    return openGroups.has(title);
  }

  return (
    <aside class="ds-sidebar">
      <div class="ds-sidebar-top">
        <a href="/design-system" class="ds-sidebar-brand">Angora</a>
        <a href="/" class="ds-sidebar-site-link">← Back to site</a>
      </div>

      <input
        type="search"
        class="ds-nav-search"
        placeholder="Search…"
        aria-label="Search design system"
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
      />

      <nav class="ds-nav">
        {filtered.map((group) => (
          <div key={group.title} class="ds-nav-section">
            <button
              type="button"
              class="ds-nav-summary"
              aria-expanded={isOpen(group.title)}
              onClick={() => toggleGroup(group.title)}
            >
              <ChevronIcon />
              {group.title}
            </button>

            {isOpen(group.title) && (
              <div class="ds-nav-group">
                {group.items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={
                      normalizePath(item.href) === currentPath
                        ? 'page'
                        : undefined
                    }
                    {...(group.external ? { target: '_blank' } : {})}
                  >
                    {item.label}
                    {group.external && <ExternalIcon />}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {darkMode && (
        <div
          style={{
            marginTop: 'auto',
            padding: 'var(--spacing-4) var(--spacing-6)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            role="switch"
            aria-checked={dark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setDark((d) => !d)}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '48px',
              height: '26px',
              padding: '3px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              background: dark ? 'var(--color-primary)' : 'var(--color-input)',
              transition: 'background 200ms var(--ease-default)',
              flexShrink: 0,
            }}
          >
            {/* Sun icon (left side) */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                color: dark ? 'oklch(0.82 0.17 80)' : 'oklch(0.72 0.15 80)',
                zIndex: 0,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </span>
            {/* Moon icon (right side) */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                color: dark ? 'oklch(0.65 0.15 260)' : 'oklch(0.55 0.12 260)',
                zIndex: 0,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
            {/* Sliding thumb with active icon */}
            <span
              style={{
                position: 'absolute',
                top: '3px',
                left: '3px',
                width: '20px',
                height: '20px',
                borderRadius: '9999px',
                background: dark ? 'var(--color-primary-foreground)' : 'var(--color-card)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
                transform: dark ? 'translateX(22px)' : 'translateX(0)',
                transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), background 200ms ease',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: dark ? 'oklch(0.65 0.15 260)' : 'oklch(0.72 0.15 80)',
              }}
            >
              <ThemeIcon dark={dark} />
            </span>
          </button>
        </div>
      )}
    </aside>
  );
}

function normalizePath(path: string) {
  return path.replace(/\/$/, '') || '/';
}
