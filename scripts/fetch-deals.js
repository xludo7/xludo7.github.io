// Weekly deal check via the Keepa API — fully automatic.
// Reads assets/watchlist.json (ASINs you're tracking), checks each one's
// current price against its 180-day average, and writes anything past the
// discount threshold to assets/deals-auto.json, which the site loads
// alongside the hand-picked deals in deals.js. The note attached to each
// entry is generated straight from the price data (e.g. "23% below its
// 180-day average"), not an invented editorial opinion — see about.html,
// which describes the process this way on purpose: it has to stay true to
// what this script actually does.

const fs = require('fs');
const path = require('path');

// Keepa domain IDs. Keepa does not track amazon.nl / amazon.com.be as
// separate catalogs as of this writing, so NL/BE watchlist entries are
// skipped with a warning rather than silently mismapped to the wrong domain.
const KEEPA_DOMAIN_IDS = { US: 1, UK: 2, DE: 3, FR: 4, IT: 8, ES: 9 };
const CURRENCY_SYMBOLS = { US: '$', UK: '£', DE: '€', FR: '€', IT: '€', ES: '€' };

const DISCOUNT_THRESHOLD = 0.15; // only keep candidates at least 15% below their 180-day average
const REQUEST_DELAY_MS = 300; // stay well under Keepa's rate limit

function centsToPrice(cents) {
  return typeof cents === 'number' && cents >= 0 ? cents / 100 : null;
}

async function fetchProduct(asin, domainId, apiKey) {
  const url = `https://api.keepa.com/product?key=${apiKey}&domain=${domainId}&asin=${asin}&stats=180`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Keepa request failed for ${asin} (domain ${domainId}): HTTP ${res.status}`);
  }
  return res.json();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const apiKey = process.env.KEEPA_API_KEY;
  if (!apiKey) {
    throw new Error('KEEPA_API_KEY environment variable is not set.');
  }

  const watchlistPath = path.join(__dirname, '..', 'assets', 'watchlist.json');
  const watchlist = JSON.parse(fs.readFileSync(watchlistPath, 'utf8'));

  const candidates = [];

  for (const item of watchlist) {
    const domainId = KEEPA_DOMAIN_IDS[item.country];
    if (!domainId) {
      console.warn(`Skipping ${item.asin}: no Keepa domain mapping for country "${item.country}".`);
      continue;
    }

    let data;
    try {
      data = await fetchProduct(item.asin, domainId, apiKey);
    } catch (err) {
      console.warn(String(err.message || err));
      continue;
    }

    const product = data.products && data.products[0];
    if (!product || !product.stats) {
      console.warn(`Skipping ${item.asin}: no stats returned by Keepa.`);
      continue;
    }

    const current = centsToPrice(product.stats.current && product.stats.current[0]);
    const avg180 = centsToPrice(product.stats.avg180 && product.stats.avg180[0]);
    if (current == null || avg180 == null || avg180 <= 0) {
      continue;
    }

    const discount = (avg180 - current) / avg180;
    if (discount < DISCOUNT_THRESHOLD) {
      continue;
    }

    const discountPct = Math.round(discount * 100);
    const symbol = CURRENCY_SYMBOLS[item.country] || '';
    candidates.push({
      id: `${item.asin}-${item.country}`.toLowerCase(),
      asin: item.asin,
      country: item.country,
      title: product.title || item.asin,
      category: item.category || 'uncategorized',
      priceNow: `${symbol}${current.toFixed(2)}`,
      priceWas: `${symbol}${avg180.toFixed(2)}`,
      discount: `-${discountPct}%`,
      note: `${discountPct}% below its 180-day average price.`,
      updated: new Date().toISOString().slice(0, 10),
    });

    await sleep(REQUEST_DELAY_MS);
  }

  const outPath = path.join(__dirname, '..', 'assets', 'deals-auto.json');
  fs.writeFileSync(outPath, JSON.stringify(candidates, null, 2) + '\n');
  console.log(`Wrote ${candidates.length} deal(s) to ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
