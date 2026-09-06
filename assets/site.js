// Renders deal cards from DEALS (hand-picked, deals.js) plus deals-auto.json
// (weekly automatic price check via Keepa, see scripts/fetch-deals.js) into
// the grids in index.html. Depends on config.js, deals.js and icons.js
// being loaded first.

function formatUpdated(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildCard(deal) {
  const country = COUNTRIES[deal.country];
  const url = deal.asin ? buildAsinUrl(deal.country, deal.asin) : buildDealUrl(deal.country, deal.query);
  const isPending = country.status === 'pending';

  const statusNote = isPending
    ? '<p class="pending-note">🔄 Affiliate link renewing for this marketplace — link below goes straight to Amazon, no referral tag yet.</p>'
    : '';
  const btnLabel = isPending ? 'View on Amazon →' : 'View Deal →';

  return `
    <div class="card">
      ${getCategoryIconMarkup(deal.category)}
      <div class="card-body">
        <span class="badge">${deal.discount}</span>
        <p class="card-title">${deal.title}</p>
        <p class="card-note">${deal.note}</p>
        <div class="prices">
          <span class="price-now">${deal.priceNow}</span>
          <span class="price-was">${deal.priceWas}</span>
        </div>
        <span class="flag">${country.flag} ${country.domain} · updated ${formatUpdated(deal.updated)}</span>
        ${statusNote}
        <a class="btn" href="${url}" target="_blank" rel="noopener sponsored">${btnLabel}</a>
      </div>
    </div>`;
}

function renderSection(sectionId, sectionKey, allDeals) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.innerHTML = allDeals.filter(d => d.section === sectionKey).map(buildCard).join('');
}

async function loadAutoDeals() {
  try {
    const res = await fetch('assets/deals-auto.json', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(d => ({ ...d, section: d.section || 'latest' }));
  } catch (err) {
    console.warn('Could not load automatic deals:', err);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const autoDeals = await loadAutoDeals();
  const allDeals = DEALS.concat(autoDeals);
  renderSection('latest-grid', 'latest', allDeals);
  renderSection('picks-grid', 'picks', allDeals);
});
