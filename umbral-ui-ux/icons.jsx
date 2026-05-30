/* ============================================================
   UMBRAL — Iconos (Lucide, ISC license). <Icon name size/>
   ============================================================ */
const ICON_PATHS = {
  "layout-dashboard": ['<rect width="7" height="9" x="3" y="3" rx="1"/>', '<rect width="7" height="5" x="14" y="3" rx="1"/>', '<rect width="7" height="9" x="14" y="12" rx="1"/>', '<rect width="7" height="5" x="3" y="16" rx="1"/>'],
  "hexagon": ['<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>'],
  "flame": ['<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'],
  "square-terminal": ['<path d="m7 11 2-2-2-2"/>', '<path d="M11 13h4"/>', '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>'],
  "layers": ['<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>', '<path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>', '<path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>'],
  "shield-check": ['<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>', '<path d="m9 12 2 2 4-4"/>'],
  "search": ['<circle cx="11" cy="11" r="8"/>', '<path d="m21 21-4.3-4.3"/>'],
  "x": ['<path d="M18 6 6 18"/>', '<path d="m6 6 12 12"/>'],
  "chevron-down": ['<path d="m6 9 6 6 6-6"/>'],
  "arrow-left": ['<path d="m12 19-7-7 7-7"/>', '<path d="M19 12H5"/>'],
  "plus": ['<path d="M5 12h14"/>', '<path d="M12 5v14"/>'],
  "check": ['<path d="M20 6 9 17l-5-5"/>'],
  "check-circle": ['<path d="M21.801 10A10 10 0 1 1 17 3.335"/>', '<path d="m9 11 3 3L22 4"/>'],
  "x-circle": ['<circle cx="12" cy="12" r="10"/>', '<path d="m15 9-6 6"/>', '<path d="m9 9 6 6"/>'],
  "alert-triangle": ['<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>', '<path d="M12 9v4"/>', '<path d="M12 17h.01"/>'],
  "alert-circle": ['<circle cx="12" cy="12" r="10"/>', '<path d="M12 8v4"/>', '<path d="M12 16h.01"/>'],
  "info": ['<circle cx="12" cy="12" r="10"/>', '<path d="M12 16v-4"/>', '<path d="M12 8h.01"/>'],
  "external-link": ['<path d="M15 3h6v6"/>', '<path d="M10 14 21 3"/>', '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'],
  "copy": ['<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>', '<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'],
  "circle": ['<circle cx="12" cy="12" r="10"/>'],
  "ban": ['<circle cx="12" cy="12" r="10"/>', '<path d="m4.9 4.9 14.2 14.2"/>'],
  "clock": ['<circle cx="12" cy="12" r="10"/>', '<polyline points="12 6 12 12 16 14"/>'],
  "git-commit": ['<circle cx="12" cy="12" r="3"/>', '<line x1="3" x2="9" y1="12" y2="12"/>', '<line x1="15" x2="21" y1="12" y2="12"/>'],
  "send": ['<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>', '<path d="m21.854 2.147-10.94 10.939"/>'],
  "sparkles": ['<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'],
  "message-circle": ['<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'],
  "message-square": ['<path d="M22 17a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/>'],
  "plus-circle": ['<circle cx="12" cy="12" r="10"/>', '<path d="M8 12h8"/>', '<path d="M12 8v8"/>'],
  "corner-down-left": ['<polyline points="9 10 4 15 9 20"/>', '<path d="M20 4v7a4 4 0 0 1-4 4H4"/>'],
  "wand": ['<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/>', '<path d="m14 7 3 3"/>', '<path d="M5 6v4"/>', '<path d="M19 14v4"/>', '<path d="M10 2v2"/>', '<path d="M7 8H3"/>', '<path d="M21 16h-4"/>', '<path d="M11 3H9"/>'],
  "list": ['<path d="M3 12h.01"/>', '<path d="M3 18h.01"/>', '<path d="M3 6h.01"/>', '<path d="M8 12h13"/>', '<path d="M8 18h13"/>', '<path d="M8 6h13"/>'],
  "git-branch": ['<line x1="6" x2="6" y1="3" y2="15"/>', '<circle cx="18" cy="6" r="3"/>', '<circle cx="6" cy="18" r="3"/>', '<path d="M18 9a9 9 0 0 1-9 9"/>'],
  "activity": ['<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>'],
  "refresh-cw": ['<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>', '<path d="M21 3v5h-5"/>', '<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>', '<path d="M8 16H3v5"/>'],
  "user": ['<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>', '<circle cx="12" cy="7" r="4"/>'],
  "maximize": ['<path d="M8 3H5a2 2 0 0 0-2 2v3"/>', '<path d="M21 8V5a2 2 0 0 0-2-2h-3"/>', '<path d="M3 16v3a2 2 0 0 0 2 2h3"/>', '<path d="M16 21h3a2 2 0 0 0 2-2v-3"/>'],
  "share-2": ['<circle cx="18" cy="5" r="3"/>', '<circle cx="6" cy="12" r="3"/>', '<circle cx="18" cy="19" r="3"/>', '<line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>', '<line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>'],
  "folder": ['<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>'],
  "folder-open": ['<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>'],
  "file-text": ['<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>', '<path d="M14 2v4a2 2 0 0 0 2 2h4"/>', '<path d="M10 9H8"/>', '<path d="M16 13H8"/>', '<path d="M16 17H8"/>'],
  "chevron-right": ['<path d="m9 18 6-6-6-6"/>'],
  "link": ['<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>', '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'],
  "git-merge": ['<circle cx="18" cy="18" r="3"/>', '<circle cx="6" cy="6" r="3"/>', '<path d="M6 21V9a9 9 0 0 0 9 9"/>'],
};

function Icon({ name, size = 20, className = "", style = {} }) {
  const paths = ICON_PATHS[name];
  if (!paths) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: paths.join("") }} />
  );
}

window.Icon = Icon;
