// Amazon Associates affiliation status per marketplace.
// This is the ONLY place a tag should ever be set — when a country is
// (re)approved, update its `tag` and `status` here and every deal link
// updates automatically. Never hardcode a tag directly in a card.
const COUNTRIES = {
  IT: { domain: 'amazon.it',       flag: '🇮🇹', tag: null, status: 'pending' },
  DE: { domain: 'amazon.de',       flag: '🇩🇪', tag: null, status: 'pending' },
  ES: { domain: 'amazon.es',       flag: '🇪🇸', tag: null, status: 'pending' },
  UK: { domain: 'amazon.co.uk',    flag: '🇬🇧', tag: null, status: 'pending' },
  NL: { domain: 'amazon.nl',       flag: '🇳🇱', tag: 'xiudxo08-21', status: 'active' },
  FR: { domain: 'amazon.fr',       flag: '🇫🇷', tag: 'xiudxo02-21', status: 'active' },
  BE: { domain: 'amazon.com.be',   flag: '🇧🇪', tag: 'xiudxo06-21', status: 'active' },
};

function buildDealUrl(countryCode, searchQuery) {
  const country = COUNTRIES[countryCode];
  const base = `https://www.${country.domain}/s?k=${encodeURIComponent(searchQuery)}`;
  return country.tag ? `${base}&tag=${country.tag}` : base;
}
