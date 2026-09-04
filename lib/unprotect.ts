export async function unprotectPDF(file: File, password?: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const createQpdf = (await import('qpdf-wasm')).default;
  const qpdf = await createQpdf({
    locateFile: (path: string) => {
      if (path.endsWith('.wasm')) return '/qpdf.wasm';
      if (path.endsWith('.js')) return '/qpdf.js';
      return path;
    }
  });
  qpdf.FS.writeFile('input.pdf', new Uint8Array(arrayBuffer));
  const args = [];
  if (password) args.push(`--password=${password}`);
  args.push('--decrypt', 'input.pdf', 'output.pdf');
  try {
    qpdf.callMain(args);
  } catch (err: any) {
    if (err?.name === 'ExitStatus' && err?.status === 0) {} else {
      console.error('QPDF Error:', err);
      throw new Error('Failed to decrypt PDF. Please check if the password is correct.');
    }
  }
  const outData = qpdf.FS.readFile('output.pdf');
  return new Uint8Array(outData);
}
