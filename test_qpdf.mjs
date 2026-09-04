global.self = global;
self.location = { href: "http://localhost/" };
self.Worker = class {
  constructor(name) {}
  postMessage() {}
};

import fs from 'fs';
global.fetch = async () => ({
  ok: true,
  arrayBuffer: async () => fs.readFileSync('./public/qpdf.wasm')
});

import createQpdf from 'qpdf-wasm';

async function test() {
  const qpdf = await createQpdf();
  qpdf.FS.writeFile('input.pdf', new Uint8Array([1, 2, 3]));
  try {
    qpdf.callMain(['--version']);
    console.log("Success with ['--version']");
  } catch(e) {
    console.log("Failed with ['--version']", e.name, e.status);
  }
  
  try {
    qpdf.callMain(['qpdf', '--version']);
    console.log("Success with ['qpdf', '--version']");
  } catch(e) {
    console.log("Failed with ['qpdf', '--version']", e.name, e.status);
  }
}
test();
