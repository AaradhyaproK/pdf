// FileZenith Service Worker
// Third-party ad scripts completely removed for Google AdSense compliance.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
