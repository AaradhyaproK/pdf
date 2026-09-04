const pipedInstances = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.tokhmi.xyz",
  "https://pipedapi.syncpundit.io",
  "https://api.piped.privacydev.net",
];

async function checkPiped() {
  for (const host of pipedInstances) {
    try {
      const res = await fetch(`${host}/streams/3RrjZaUvG0Y`, { signal: AbortSignal.timeout(3000) });
      const text = await res.text();
      console.log(`[Piped] ${host}: ${res.status} - length: ${text.length}`);
    } catch (e) {
      console.log(`[Piped] ${host}: ERROR ${e.message}`);
    }
  }
}
checkPiped();
