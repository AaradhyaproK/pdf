const fetch = require('node-fetch');
const fs = require('fs');

async function scrape() {
  try {
    // We can fetch from Wikipedia or a known JSON endpoint
    const res = await fetch('https://raw.githubusercontent.com/sahilm/rto-codes/master/rto_codes.json');
    if (res.ok) {
        const data = await res.json();
        console.log(Object.keys(data).length + " RTOs found");
    } else {
        console.log("Not found");
    }
  } catch (e) {
      console.log(e);
  }
}
scrape();
