'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toast } from 'sonner';
import {
  Receipt,
  FileText,
  Plus,
  Trash2,
  Download,
  Building,
  User,
  DollarSign,
  Calendar,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Home,
} from 'lucide-react';
import { FileReadyModal } from '@/components/FileReadyModal';
import { renderPDFPagesToImages } from '@/lib/pdf-engine';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGeneratorPage() {
  const [docType, setDocType] = useState<'invoice' | 'rent-receipt'>('invoice');

  // Currency
  const [currency, setCurrency] = useState('$');

  // Business / Invoice States
  const [fromName, setFromName] = useState('Alex Rivera / Studio Zenith');
  const [fromEmail, setFromEmail] = useState('alex@zenithstudio.com');
  const [toName, setToName] = useState('Acme Corporation Inc.');
  const [toEmail, setToEmail] = useState('billing@acmecorp.com');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${new Date().getFullYear()}-001`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [taxRate, setTaxRate] = useState<number>(10);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Full-Stack Web Application Development (Phase 1)', quantity: 40, rate: 85 },
    { id: '2', description: 'UI/UX Design System & Interactive Prototypes', quantity: 1, rate: 1200 },
  ]);

  // Rent Receipt States
  const [tenantName, setTenantName] = useState('Rahul Sharma');
  const [landlordName, setLandlordName] = useState('Suresh Patel');
  const [landlordPan, setLandlordPan] = useState('ABCDE1234F');
  const [rentAmount, setRentAmount] = useState<number>(25000);
  const [rentMonth, setRentMonth] = useState('October 2026');
  const [propertyAddress, setPropertyAddress] = useState('Flat 402, Green Glen Heights, Bellandur, Bengaluru');

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string>('');
  const [invoicePreviewUrl, setInvoicePreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const addItem = () => {
    setItems([
      ...items,
      { id: `item-${Date.now()}`, description: 'Consulting / Design Services', quantity: 1, rate: 100 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, val: string | number) => {
    setItems(
      items.map((i) => {
        if (i.id === id) {
          return { ...i, [field]: val };
        }
        return i;
      })
    );
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // Standard A4 (pt)
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const { width, height } = page.getSize();

      if (docType === 'invoice') {
        // --- DRAW INVOICE ---
        // Header Banner
        page.drawRectangle({
          x: 40,
          y: height - 100,
          width: width - 80,
          height: 60,
          color: rgb(0.06, 0.09, 0.16), // Dark slate
        });

        page.drawText('INVOICE', {
          x: 60,
          y: height - 68,
          size: 24,
          font: fontBold,
          color: rgb(1, 1, 1),
        });

        page.drawText(`#${invoiceNumber}`, {
          x: width - 200,
          y: height - 64,
          size: 14,
          font: fontBold,
          color: rgb(0.38, 0.44, 0.99), // Indigo
        });

        // From / To Info
        let y = height - 130;
        page.drawText('BILLED FROM:', { x: 50, y, size: 9, font: fontBold, color: rgb(0.4, 0.45, 0.5) });
        page.drawText('BILLED TO:', { x: 300, y, size: 9, font: fontBold, color: rgb(0.4, 0.45, 0.5) });

        y -= 16;
        page.drawText(fromName, { x: 50, y, size: 12, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
        page.drawText(toName, { x: 300, y, size: 12, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

        y -= 14;
        page.drawText(fromEmail, { x: 50, y, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
        page.drawText(toEmail, { x: 300, y, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

        y -= 25;
        page.drawText(`Date: ${invoiceDate}  |  Due Date: ${dueDate}`, {
          x: 50,
          y,
          size: 10,
          font: fontRegular,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Items Table Header
        y -= 30;
        page.drawRectangle({
          x: 40,
          y: y - 8,
          width: width - 80,
          height: 24,
          color: rgb(0.95, 0.96, 0.98),
        });

        page.drawText('Description', { x: 50, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
        page.drawText('Qty / Hrs', { x: 340, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
        page.drawText('Rate', { x: 420, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
        page.drawText('Amount', { x: 490, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) });

        // Items Rows
        y -= 24;
        items.forEach((item) => {
          const itemTotal = item.quantity * item.rate;
          page.drawText(item.description.substring(0, 48), {
            x: 50,
            y,
            size: 10,
            font: fontRegular,
            color: rgb(0.1, 0.1, 0.1),
          });
          page.drawText(`${item.quantity}`, { x: 340, y, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
          page.drawText(`${currency}${item.rate.toLocaleString()}`, {
            x: 420,
            y,
            size: 10,
            font: fontRegular,
            color: rgb(0.1, 0.1, 0.1),
          });
          page.drawText(`${currency}${itemTotal.toLocaleString()}`, {
            x: 490,
            y,
            size: 10,
            font: fontBold,
            color: rgb(0.1, 0.1, 0.1),
          });

          // Horizontal line
          page.drawLine({
            start: { x: 40, y: y - 8 },
            end: { x: width - 40, y: y - 8 },
            color: rgb(0.9, 0.9, 0.9),
            thickness: 0.5,
          });
          y -= 24;
        });

        // Totals
        y -= 20;
        page.drawText(`Subtotal:`, { x: 380, y, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
        page.drawText(`${currency}${subtotal.toLocaleString()}`, {
          x: 470,
          y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1),
        });

        y -= 18;
        page.drawText(`Tax / GST (${taxRate}%):`, {
          x: 380,
          y,
          size: 10,
          font: fontRegular,
          color: rgb(0.3, 0.3, 0.3),
        });
        page.drawText(`${currency}${taxAmount.toLocaleString()}`, {
          x: 470,
          y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1),
        });

        y -= 24;
        page.drawRectangle({
          x: 360,
          y: y - 6,
          width: width - 400,
          height: 28,
          color: rgb(0.31, 0.27, 0.9), // Indigo
        });
        page.drawText(`TOTAL DUE:`, { x: 375, y: y + 2, size: 11, font: fontBold, color: rgb(1, 1, 1) });
        page.drawText(`${currency}${totalAmount.toLocaleString()}`, {
          x: 470,
          y: y + 2,
          size: 12,
          font: fontBold,
          color: rgb(1, 1, 1),
        });

        // Footer
        page.drawText('Thank you for your business! Generated with FileZenith (Zero Cloud Uploads).', {
          x: 50,
          y: 40,
          size: 8,
          font: fontRegular,
          color: rgb(0.5, 0.5, 0.5),
        });
      } else {
        // --- DRAW HRA RENT RECEIPT ---
        page.drawRectangle({
          x: 40,
          y: height - 100,
          width: width - 80,
          height: 60,
          color: rgb(0.06, 0.09, 0.16),
        });

        page.drawText('RENT RECEIPT FOR HRA CLAIM', {
          x: 60,
          y: height - 68,
          size: 18,
          font: fontBold,
          color: rgb(1, 1, 1),
        });

        page.drawText(`Section 10(13A) IT Act`, {
          x: width - 210,
          y: height - 64,
          size: 11,
          font: fontBold,
          color: rgb(0.38, 0.44, 0.99),
        });

        let y = height - 140;
        page.drawText('RECEIPT ACKNOWLEDGEMENT', {
          x: 50,
          y,
          size: 12,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1),
        });

        y -= 25;
        const text = `Received with thanks from ${tenantName} a sum of Rs. ${rentAmount.toLocaleString('en-IN')}/- (Rupees ${rentAmount.toLocaleString('en-IN')} only) towards the house rent for the month / period of ${rentMonth} for the residential premises situated at:`;
        page.drawText(text, {
          x: 50,
          y,
          size: 10,
          font: fontRegular,
          color: rgb(0.2, 0.2, 0.2),
          maxWidth: width - 100,
          lineHeight: 16,
        });

        y -= 50;
        page.drawText(`Address: ${propertyAddress}`, {
          x: 50,
          y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1),
        });

        y -= 30;
        page.drawText(`Landlord Name: ${landlordName}`, {
          x: 50,
          y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1),
        });

        y -= 18;
        page.drawText(`Landlord PAN Number: ${landlordPan} (Mandatory for rent > Rs. 1,00,000/yr)`, {
          x: 50,
          y,
          size: 10,
          font: fontBold,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Signature Box
        y -= 70;
        page.drawRectangle({
          x: width - 220,
          y: y - 50,
          width: 170,
          height: 60,
          borderColor: rgb(0.7, 0.7, 0.7),
          borderWidth: 1,
        });
        page.drawText('Signature of Landlord', {
          x: width - 200,
          y: y - 40,
          size: 9,
          font: fontRegular,
          color: rgb(0.4, 0.4, 0.4),
        });

        // Revenue stamp box
        page.drawRectangle({
          x: 60,
          y: y - 50,
          width: 70,
          height: 60,
          borderColor: rgb(0.7, 0.7, 0.7),
          borderWidth: 1,
        });
        page.drawText('Affix Re. 1\nRevenue Stamp', {
          x: 68,
          y: y - 25,
          size: 8,
          font: fontRegular,
          color: rgb(0.4, 0.4, 0.4),
          lineHeight: 12,
        });

        // Footer
        page.drawText('Valid for Income Tax Department HRA Exemption filing. Generated via FileZenith.', {
          x: 50,
          y: 40,
          size: 8,
          font: fontRegular,
          color: rgb(0.5, 0.5, 0.5),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const filename =
        docType === 'invoice'
          ? `${invoiceNumber}_Invoice.pdf`
          : `Rent_Receipt_${rentMonth.replace(/\s+/g, '_')}.pdf`;

      // Generate visual PDF page preview for modal
      let preview: string | null = null;
      try {
        const dummyFile = new File([blob], filename, { type: 'application/pdf' });
        const rendered = await renderPDFPagesToImages(dummyFile, 1.2);
        if (rendered.length > 0) {
          preview = rendered[0].dataUrl;
        }
      } catch (renderErr) {
        console.warn('PDF preview render error:', renderErr);
      }

      setDownloadUrl(url);
      setDownloadFileName(filename);
      setInvoicePreviewUrl(preview);
      setIsModalOpen(true);
      toast.success('Generated professional vector PDF!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF invoice.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolLayout
      slug="/utility/invoice-generator"
      title="Free Invoice & Rent Receipt Generator (No Sign-Up, Instant PDF)"
      subtitle="Create professional client invoices and HRA rent receipts for tax deductions. 100% free with instant clean vector PDF download—no account or login required."
      badgeText="Zero Sign-Up Invoice Maker"
    >
      <div className="space-y-6 text-slate-800">
        {/* Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 space-y-1">
            <p className="font-bold">
              100% Free, Private &amp; Zero Sign-Up Required
            </p>
            <p className="text-indigo-800 leading-relaxed">
              Unlike accounting SaaS tools that lock your files behind paywalls and email gates, FileZenith renders your PDF directly in your browser. Your financial numbers and client details remain completely private on your machine.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3">
          <button
            onClick={() => setDocType('invoice')}
            className={`flex-1 py-3 px-4 rounded-2xl border text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              docType === 'invoice'
                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Freelance &amp; Business Invoice</span>
          </button>

          <button
            onClick={() => setDocType('rent-receipt')}
            className={`flex-1 py-3 px-4 rounded-2xl border text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              docType === 'rent-receipt'
                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>HRA Rent Receipt (Tax Exemption)</span>
          </button>
        </div>

        {/* Form Workspace */}
        {docType === 'invoice' ? (
          <div className="space-y-5">
            {/* Header / Parties */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-3">
                <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  Your Business / Freelancer Info
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Company / Your Name</label>
                  <input
                    type="text"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Email / Phone</label>
                  <input
                    type="text"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  Client / Billed To Info
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Client / Company Name</label>
                  <input
                    type="text"
                    value={toName}
                    onChange={(e) => setToName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Client Email / Billing Address</label>
                  <input
                    type="text"
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Dates & Meta */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Currency Symbol</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                >
                  <option value="$">USD ($)</option>
                  <option value="₹">INR (₹)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="C$">CAD (C$)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Issue Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="font-black text-slate-900 uppercase tracking-wider">
                  Invoice Line Items &amp; Services:
                </div>
                <button
                  onClick={addItem}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Line Item
                </button>
              </div>

              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-3 items-center p-3 rounded-2xl bg-slate-50 border border-slate-200"
                  >
                    <div className="col-span-12 sm:col-span-6">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Quantity / Hrs</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold text-slate-900"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Rate ({currency})</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold text-slate-900"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2 flex items-center justify-between pt-3 sm:pt-0">
                      <span className="font-bold text-slate-900">
                        {currency}
                        {(item.quantity * item.rate).toLocaleString()}
                      </span>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary & Tax */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-end sm:justify-between gap-4">
                <div className="w-full sm:w-auto flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Tax / GST Rate:</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-16 p-2 rounded-lg border border-slate-300 font-bold text-center"
                  />
                  <span className="text-xs text-slate-500">%</span>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 text-xs text-right">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-800">
                      {currency}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax ({taxRate}%):</span>
                    <span className="font-bold text-slate-800">
                      {currency}
                      {taxAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-indigo-700 pt-1 border-t border-slate-200">
                    <span>Total Due:</span>
                    <span>
                      {currency}
                      {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* HRA Rent Receipt Form */
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Home className="w-4 h-4 text-indigo-600" />
              <span>HRA Rent Receipt Particulars (Section 10(13A))</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Tenant Name (Employee)</label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Landlord Name (Property Owner)</label>
                <input
                  type="text"
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Landlord PAN Number (Mandatory if &gt; ₹1L/yr)</label>
                <input
                  type="text"
                  value={landlordPan}
                  onChange={(e) => setLandlordPan(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Monthly Rent Paid (₹)</label>
                <input
                  type="number"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Rental Month / Period</label>
                <input
                  type="text"
                  value={rentMonth}
                  onChange={(e) => setRentMonth(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                  placeholder="e.g. October 2026"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Rented House Address</label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div>
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isGenerating
              ? 'Rendering Vector PDF...'
              : `Download Professional ${docType === 'invoice' ? 'Invoice' : 'Rent Receipt'} PDF`}
          </button>
        </div>

        {/* Celebratory Completion Modal with Preview & Confetti */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={downloadUrl}
          fileName={downloadFileName || 'Invoice.pdf'}
          previewUrl={invoicePreviewUrl}
          fileType="pdf"
          title={`Your ${docType === 'invoice' ? 'Invoice' : 'Rent Receipt'} is Ready`}
          subtitle="Rendered in clean vector PDF format with zero watermarks and zero cloud uploads."
        />
      </div>
    </ToolLayout>
  );
}
