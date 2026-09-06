// Neutral flat-line category icons, drawn inline as SVG — no external image
// requests, no Amazon product imagery. Swap for real product photos once a
// licensed source (PA-API on an active tag, or our own photos) is available.
const CATEGORY_ICONS = {
  smartphone: { bg: '#eef2ff', fg: '#4f46e5',
    svg: '<rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/>' },
  laptop: { bg: '#f0fdf4', fg: '#16a34a',
    svg: '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M2 19h20l-1.5-3h-17z"/>' },
  audio: { bg: '#fdf2f8', fg: '#db2777',
    svg: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2" y="13" width="5" height="7" rx="1.5"/><rect x="17" y="13" width="5" height="7" rx="1.5"/>' },
  vacuum: { bg: '#f0f9ff', fg: '#0284c7',
    svg: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>' },
  tablet: { bg: '#eef2ff', fg: '#4338ca',
    svg: '<rect x="4" y="3" width="16" height="18" rx="2"/><line x1="11" y1="19" x2="13" y2="19"/>' },
  gaming: { bg: '#faf5ff', fg: '#9333ea',
    svg: '<rect x="2" y="8" width="20" height="9" rx="4"/><line x1="7" y1="11" x2="7" y2="14"/><line x1="5.5" y1="12.5" x2="8.5" y2="12.5"/><circle cx="16" cy="11.5" r="1"/><circle cx="18.5" cy="14" r="1"/>' },
  ereader: { bg: '#fefce8', fg: '#ca8a04',
    svg: '<rect x="5" y="2" width="14" height="20" rx="1.5"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="13" y2="15"/>' },
  'smart-speaker': { bg: '#f5f3ff', fg: '#7c3aed',
    svg: '<rect x="7" y="2" width="10" height="20" rx="5"/><circle cx="12" cy="8" r="1.2"/>' },
  streaming: { bg: '#fff7ed', fg: '#ea580c',
    svg: '<rect x="2" y="5" width="20" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="18" x2="12" y2="21"/>' },
  storage: { bg: '#f0fdfa', fg: '#0d9488',
    svg: '<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="8" cy="12" r="1"/><line x1="12" y1="12" x2="17" y2="12"/>' },
  'smart-home': { bg: '#fffbeb', fg: '#d97706',
    svg: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11.2V16h6v-1.8A6 6 0 0 0 12 3z"/>' },
  kitchen: { bg: '#fef2f2', fg: '#dc2626',
    svg: '<path d="M4 10h16v2a8 8 0 0 1-16 0z"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="8" y1="6" x2="8" y2="3"/><line x1="16" y1="6" x2="16" y2="3"/>' },
  peripheral: { bg: '#ecfeff', fg: '#0891b2',
    svg: '<rect x="7" y="2" width="10" height="20" rx="5"/><line x1="12" y1="2" x2="12" y2="9"/>' },
};

function getCategoryIconMarkup(category) {
  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.smartphone;
  return `
    <div class="icon-wrap" style="background:${icon.bg}">
      <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="${icon.fg}"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icon.svg}</svg>
    </div>`;
}
