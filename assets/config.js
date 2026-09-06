// Amazon Associates affiliation status per marketplace.
// This is the ONLY place a tag should ever be set — when a country is
// (re)approved, update its `tag` and `status` here and every deal link
// updates automatically. Never hardcode a tag directly in a card.
const COUNTRIES = {
  IT: { domain: 'amazon.it',       flag: '🇮🇹', tag: 'xiudxo0c5-21', status: 'active' },
  DE: { domain: 'amazon.de',       flag: '🇩🇪', tag: 'xiudxo0dd-21', status: 'active' },
  ES: { domain: 'amazon.es',       flag: '🇪🇸', tag: 'xiudxo0e-21', status: 'active' },
  UK: { domain: 'amazon.co.uk',    flag: '🇬🇧', tag: 'xiudxo04-21', status: 'active' },
  NL: { domain: 'amazon.nl',       flag: '🇳🇱', tag: 'xiudxo08-21', status: 'active' },
  FR: { domain: 'amazon.fr',       flag: '🇫🇷', tag: 'xiudxo02-21', status: 'active' },
  BE: { domain: 'amazon.com.be',   flag: '🇧🇪', tag: 'xiudxo06-21', status: 'active' },
};

function buildDealUrl(countryCode, searchQuery) {
  const country = COUNTRIES[countryCode];
  const base = `https://www.${country.domain}/s?k=${encodeURIComponent(searchQuery)}`;
  return country.tag ? `${base}&tag=${country.tag}` : base;
}

function buildAsinUrl(countryCode, asin) {
  const country = COUNTRIES[countryCode];
  const base = `https://www.${country.domain}/dp/${asin}`;
  return country.tag ? `${base}?tag=${country.tag}` : base;
}
