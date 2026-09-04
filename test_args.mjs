import fs from 'fs';
global.self = global;
self.location = { href: "http://localhost/" };
self.Worker = class { constructor() {} postMessage() {} };

import createQpdf from 'qpdf-wasm';

async function test() {
  const wasmBuffer = fs.readFileSync('./public/qpdf.wasm');
  const qpdf = await createQpdf({
    instantiateWasm: (imports, successCallback) => {
      WebAssembly.instantiate(wasmBuffer, imports).then(out => {
        successCallback(out.instance);
      });
      return {};
    }
  });

  try {
    qpdf.callMain(['--version']);
    console.log("SUCCESS: ['--version'] worked");
  } catch(e) {
    console.log("ERROR: ['--version'] failed:", e.name, e.status);
  }

  try {
    qpdf.callMain(['qpdf', '--version']);
    console.log("SUCCESS: ['qpdf', '--version'] worked");
  } catch(e) {
    console.log("ERROR: ['qpdf', '--version'] failed:", e.name, e.status);
  }
}
test();
