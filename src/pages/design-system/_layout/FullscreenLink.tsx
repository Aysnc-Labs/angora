import { useState, useEffect } from 'preact/hooks';

interface Props {
  href: string;
  darkMode?: boolean;
}

export default function FullscreenLink({ href, darkMode = false }: Props) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!darkMode) return;
    const root = document.documentElement;
    setDark(root.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setDark(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [darkMode]);

  const resolvedHref = darkMode && dark
    ? href.replace('/view/light/', '/view/dark/')
    : href;

  return (
    <a
      href={resolvedHref}
      class="ds-fullscreen-link"
      target="_blank"
    >
      View full screen
    </a>
  );
}
