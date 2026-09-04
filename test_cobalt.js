const cobaltInstances = [
  "https://cobalt-api.kwiatekm.me/api/json",
  "https://api.cobalt.tools/api/json",
  "https://cobalt.seasi.dev/api/json",
  "https://cobalt.s.marte.app/api/json",
  "https://cobalt.q0.ovh/api/json"
];

async function checkCobalt() {
  for (const host of cobaltInstances) {
    try {
      const res = await fetch(host, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", downloadMode: "auto" }),
        signal: AbortSignal.timeout(3000)
      });
      const data = await res.json();
      console.log(`[Cobalt] ${host}: ${res.status} - url: ${data.url || data.status || data.error?.code}`);
    } catch (e) {
      console.log(`[Cobalt] ${host}: ERROR ${e.message}`);
    }
  }
}
checkCobalt();
