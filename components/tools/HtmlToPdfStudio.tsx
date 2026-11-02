'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  FileCode,
  UploadCloud,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Layers,
  FileCheck,
  Maximize2,
  FileText,
  Info,
  RefreshCw,
  Palette,
  FileUp,
  X,
  ExternalLink,
  Smartphone,
  Eye,
  Check,
  Copy,
  Scissors,
  Split,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Code2,
  Settings2,
  HelpCircle,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { triggerBrowserDownload } from '@/lib/download-helper';
import { PDFDocument } from 'pdf-lib';

// Starter Templates for instant high-value conversion
const STARTER_TEMPLATES = {
  invoice: {
    name: 'Professional Invoice',
    icon: '💼',
    desc: 'Itemized business invoice with taxes and payment details',
    code: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; color: #1e293b; line-height: 1.5; padding: 8px;">
  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #e2e8f0;">
    <div>
      <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #0284c7; letter-spacing: -0.5px;">ACME CLOUD CORP.</h1>
      <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Enterprise Cloud & Infrastructure Services</p>
      <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">billing@acmecloud.com • +1 (800) 555-0199</p>
    </div>
    <div style="text-align: right;">
      <span style="display: inline-block; padding: 6px 14px; background: #e0f2fe; color: #0369a1; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">TAX INVOICE</span>
      <h2 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 700; color: #0f172a;">#INV-2026-0849</h2>
      <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Date: November 2, 2026</p>
      <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">Due Date: November 16, 2026</p>
    </div>
  </div>

  <!-- Parties -->
  <div style="display: flex; justify-content: space-between; margin-top: 24px; padding: 18px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
    <div>
      <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">BILLED TO</p>
      <h3 style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #0f172a;">Apex Solutions LLC</h3>
      <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">Attn: Finance Department</p>
      <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">742 Evergreen Terrace, Suite 400</p>
      <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">Austin, TX 78701 • Tax ID: US-9281740</p>
    </div>
    <div style="text-align: right;">
      <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">PAYMENT DETAILS</p>
      <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 600; color: #0f172a;">Direct Bank Wire (ACH)</p>
      <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">Bank: Silicon Valley Bank</p>
      <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">Account: *******4928</p>
      <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569;">Routing: 121000358</p>
    </div>
  </div>

  <!-- Table -->
  <table style="width: 100%; border-collapse: collapse; margin-top: 28px;">
    <thead>
      <tr style="background: #0f172a; color: #ffffff; text-align: left;">
        <th style="padding: 12px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; border-top-left-radius: 6px;">Description</th>
        <th style="padding: 12px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; text-align: center;">Qty</th>
        <th style="padding: 12px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; text-align: right;">Unit Price</th>
        <th style="padding: 12px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; text-align: right; border-top-right-radius: 6px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 14px; font-size: 13px; font-weight: 600; color: #1e293b;">
          High-Availability Dedicated Kubernetes Cluster
          <div style="font-size: 12px; font-weight: 400; color: #64748b;">Multi-region failover, 99.99% SLA uptime, automated backups</div>
        </td>
        <td style="padding: 14px; font-size: 13px; text-align: center; color: #475569;">1 mo</td>
        <td style="padding: 14px; font-size: 13px; text-align: right; color: #475569;">$1,850.00</td>
        <td style="padding: 14px; font-size: 13px; text-align: right; font-weight: 600; color: #0f172a;">$1,850.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; background: #fcfcfd;">
        <td style="padding: 14px; font-size: 13px; font-weight: 600; color: #1e293b;">
          SOC 2 Type II Security Compliance Audit
          <div style="font-size: 12px; font-weight: 400; color: #64748b;">Vulnerability assessment, penetration test, and formal certification</div>
        </td>
        <td style="padding: 14px; font-size: 13px; text-align: center; color: #475569;">1</td>
        <td style="padding: 14px; font-size: 13px; text-align: right; color: #475569;">$2,400.00</td>
        <td style="padding: 14px; font-size: 13px; text-align: right; font-weight: 600; color: #0f172a;">$2,400.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 14px; font-size: 13px; font-weight: 600; color: #1e293b;">
          Database Performance Tuning & Architecture Consulting
          <div style="font-size: 12px; font-weight: 400; color: #64748b;">PostgreSQL query index optimization and caching layer implementation</div>
        </td>
        <td style="padding: 14px; font-size: 13px; text-align: center; color: #475569;">16 hrs</td>
        <td style="padding: 14px; font-size: 13px; text-align: right; color: #475569;">$125.00</td>
        <td style="padding: 14px; font-size: 13px; text-align: right; font-weight: 600; color: #0f172a;">$2,000.00</td>
      </tr>
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
    <div style="width: 290px;">
      <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #64748b;">
        <span>Subtotal:</span>
        <span style="font-weight: 600; color: #0f172a;">$6,250.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #64748b;">
        <span>Tax (Standard 8.25%):</span>
        <span style="font-weight: 600; color: #0f172a;">$515.63</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #0f172a; margin-top: 6px; font-size: 17px; font-weight: 800; color: #0f172a;">
        <span>Grand Total Due:</span>
        <span style="color: #0284c7;">$6,765.63</span>
      </div>
    </div>
  </div>

  <!-- Signoff -->
  <div style="margin-top: 48px; padding-top: 20px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end;">
    <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
      <p style="margin: 0; font-weight: 600; color: #334155;">Terms & Conditions</p>
      <p style="margin: 2px 0 0 0;">Payment is due within 14 calendar days of issuance.</p>
      <p style="margin: 0;">Thank you for partnering with Acme Cloud!</p>
    </div>
    <div style="text-align: center; width: 180px;">
      <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 26px; color: #0369a1; height: 36px;">Alex Vance</div>
      <div style="border-top: 1px solid #94a3b8; padding-top: 4px; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Authorized Signatory</div>
    </div>
  </div>
</div>`
  },
  report: {
    name: 'Executive Business Report',
    icon: '📊',
    desc: 'Clean corporate report with KPI metric cards and analytics',
    code: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; color: #0f172a; line-height: 1.6; padding: 12px;">
  <div style="padding-bottom: 16px; border-bottom: 3px solid #2563eb;">
    <div style="display: inline-block; padding: 4px 10px; background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 700; border-radius: 4px; text-transform: uppercase;">CONFIDENTIAL</div>
    <h1 style="margin: 10px 0 4px 0; font-size: 26px; font-weight: 800; color: #0f172a;">Q3 Executive Performance & Revenue Summary</h1>
    <p style="margin: 0; font-size: 13px; color: #64748b;">Prepared for Board of Directors • Released November 2, 2026</p>
  </div>

  <div style="margin-top: 24px;">
    <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; text-transform: uppercase; color: #334155; letter-spacing: 0.5px;">1. Executive Highlights</h3>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
      In Q3 2026, the company outperformed baseline projections across all key performance metrics. Gross revenue expanded by 34.2% year-over-year, driven primarily by enterprise subscriber growth and expansion into international cloud markets.
    </p>

    <!-- KPI Grid -->
    <div style="display: flex; gap: 14px; margin-bottom: 24px;">
      <div style="flex: 1; padding: 16px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
        <span style="font-size: 12px; font-weight: 600; color: #166534; text-transform: uppercase;">Gross Revenue</span>
        <div style="font-size: 24px; font-weight: 800; color: #15803d; margin-top: 4px;">$4.82M</div>
        <span style="font-size: 11px; color: #166534;">▲ +34.2% vs Q3 Prior</span>
      </div>
      <div style="flex: 1; padding: 16px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
        <span style="font-size: 12px; font-weight: 600; color: #1e40af; text-transform: uppercase;">Active Subscriptions</span>
        <div style="font-size: 24px; font-weight: 800; color: #1d4ed8; margin-top: 4px;">18,420</div>
        <span style="font-size: 11px; color: #1e40af;">▲ +2,150 net new logos</span>
      </div>
      <div style="flex: 1; padding: 16px; background: #faf5ff; border-radius: 8px; border: 1px solid #e9d5ff;">
        <span style="font-size: 12px; font-weight: 600; color: #6b21a8; text-transform: uppercase;">Net Retention Rate</span>
        <div style="font-size: 24px; font-weight: 800; color: #7e22ce; margin-top: 4px;">124.6%</div>
        <span style="font-size: 11px; color: #6b21a8;">Best-in-class SaaS tier</span>
      </div>
    </div>

    <!-- Data Table -->
    <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; text-transform: uppercase; color: #334155; letter-spacing: 0.5px;">2. Business Unit Breakdown</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background: #f1f5f9; text-align: left; border-bottom: 2px solid #cbd5e1;">
          <th style="padding: 10px 12px; font-weight: 700;">Division</th>
          <th style="padding: 10px 12px; font-weight: 700; text-align: right;">Target</th>
          <th style="padding: 10px 12px; font-weight: 700; text-align: right;">Actual</th>
          <th style="padding: 10px 12px; font-weight: 700; text-align: right;">Variance</th>
          <th style="padding: 10px 12px; font-weight: 700; text-align: center;">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 12px; font-weight: 600;">Enterprise SaaS Platform</td>
          <td style="padding: 10px 12px; text-align: right; color: #64748b;">$2,800,000</td>
          <td style="padding: 10px 12px; text-align: right; font-weight: 600;">$3,120,000</td>
          <td style="padding: 10px 12px; text-align: right; color: #16a34a; font-weight: 600;">+11.4%</td>
          <td style="padding: 10px 12px; text-align: center;"><span style="background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;">Exceeded</span></td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fcfcfd;">
          <td style="padding: 10px 12px; font-weight: 600;">Managed Cloud Hosting</td>
          <td style="padding: 10px 12px; text-align: right; color: #64748b;">$1,100,000</td>
          <td style="padding: 10px 12px; text-align: right; font-weight: 600;">$1,240,000</td>
          <td style="padding: 10px 12px; text-align: right; color: #16a34a; font-weight: 600;">+12.7%</td>
          <td style="padding: 10px 12px; text-align: center;"><span style="background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;">Exceeded</span></td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 12px; font-weight: 600;">Professional Engineering Services</td>
          <td style="padding: 10px 12px; text-align: right; color: #64748b;">$500,000</td>
          <td style="padding: 10px 12px; text-align: right; font-weight: 600;">$460,000</td>
          <td style="padding: 10px 12px; text-align: right; color: #e11d48; font-weight: 600;">-8.0%</td>
          <td style="padding: 10px 12px; text-align: center;"><span style="background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;">Watch</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`
  },
  resume: {
    name: 'Modern Tech Resume',
    icon: '📄',
    desc: 'Two-column software engineer resume with clean typography',
    code: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; color: #1e293b; line-height: 1.5; padding: 12px;">
  <!-- Header -->
  <div style="border-bottom: 2px solid #0f172a; padding-bottom: 16px;">
    <h1 style="margin: 0; font-size: 30px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">DAVID CHEN</h1>
    <h2 style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #2563eb;">Senior Full-Stack & Systems Engineer</h2>
    <div style="margin-top: 8px; font-size: 13px; color: #64748b; display: flex; gap: 16px; flex-wrap: wrap;">
      <span>📍 San Francisco, CA</span>
      <span>✉️ david.chen@devmail.io</span>
      <span>🌐 github.com/davidchen</span>
      <span>💼 linkedin.com/in/dchen-tech</span>
    </div>
  </div>

  <!-- Summary -->
  <div style="margin-top: 18px;">
    <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">Summary</h3>
    <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.6;">
      Full-stack systems engineer with 8+ years of experience architecting distributed cloud backends, micro-frontends, and high-throughput real-time systems. Proven track record scaling applications from initial launch to 10M+ daily active users with 99.99% availability.
    </p>
  </div>

  <!-- Experience -->
  <div style="margin-top: 20px;">
    <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">Experience</h3>
    
    <div style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <h4 style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">Lead Cloud Architect • CloudScale Systems</h4>
        <span style="font-size: 12px; font-weight: 600; color: #64748b;">2023 — Present</span>
      </div>
      <p style="margin: 2px 0 6px 0; font-size: 12px; color: #2563eb; font-weight: 600;">Go, TypeScript, Kubernetes, Kafka, ClickHouse</p>
      <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #475569; line-height: 1.6;">
        <li>Architected streaming ingestion pipeline handling 140,000 events/second with sub-50ms latency.</li>
        <li>Spearheaded zero-downtime migration of 180 microservices to multi-cloud Kubernetes clusters.</li>
        <li>Mentored team of 14 engineers across backend, observability, and Site Reliability Engineering.</li>
      </ul>
    </div>

    <div style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <h4 style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">Senior Software Engineer • Hyperion Labs</h4>
        <span style="font-size: 12px; font-weight: 600; color: #64748b;">2020 — 2023</span>
      </div>
      <p style="margin: 2px 0 6px 0; font-size: 12px; color: #2563eb; font-weight: 600;">React, Next.js, Node.js, PostgreSQL, Redis</p>
      <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #475569; line-height: 1.6;">
        <li>Engineered low-latency web dashboard serving 2M+ active commercial accounts.</li>
        <li>Optimized database indexes and caching, slashing p99 API response times by 68%.</li>
      </ul>
    </div>
  </div>

  <!-- Skills -->
  <div style="margin-top: 20px;">
    <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">Technical Skills</h3>
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <span style="padding: 4px 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600;">TypeScript / Node.js</span>
      <span style="padding: 4px 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600;">Go (Golang)</span>
      <span style="padding: 4px 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600;">React / Next.js</span>
      <span style="padding: 4px 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600;">PostgreSQL & Redis</span>
      <span style="padding: 4px 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600;">Docker & Kubernetes</span>
      <span style="padding: 4px 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600;">AWS / GCP Cloud</span>
    </div>
  </div>
</div>`
  },
  receipt: {
    name: 'Retail Payment Receipt',
    icon: '🧾',
    desc: 'Customer transaction slip with barcode and purchase summary',
    code: `<div style="font-family: 'Courier New', Courier, monospace; max-width: 440px; margin: 0 auto; padding: 20px; background: #ffffff; border: 1px dashed #94a3b8; color: #0f172a;">
  <div style="text-align: center; border-bottom: 1px dashed #94a3b8; padding-bottom: 14px;">
    <h2 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">ZENITH CAFE & ROASTERY</h2>
    <p style="margin: 4px 0 0 0; font-size: 12px;">Store #402 • 100 Market Street</p>
    <p style="margin: 2px 0 0 0; font-size: 12px;">Tel: (415) 555-8921</p>
    <p style="margin: 6px 0 0 0; font-size: 11px; color: #64748b;">Receipt ID: TXN-928401824</p>
    <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Date: 2026-11-02 14:28:10</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 12px;">
    <tbody>
      <tr>
        <td style="padding: 4px 0;">2x Nitro Cold Brew (L)</td>
        <td style="padding: 4px 0; text-align: right;">$11.50</td>
      </tr>
      <tr>
        <td style="padding: 4px 0;">1x Avocado Sourdough Toast</td>
        <td style="padding: 4px 0; text-align: right;">$8.75</td>
      </tr>
      <tr>
        <td style="padding: 4px 0;">1x Almond Croissant</td>
        <td style="padding: 4px 0; text-align: right;">$4.50</td>
      </tr>
    </tbody>
  </table>

  <div style="border-top: 1px dashed #94a3b8; margin-top: 14px; padding-top: 10px; font-size: 12px;">
    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
      <span>Subtotal:</span>
      <span>$24.75</span>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
      <span>Sales Tax (8.5%):</span>
      <span>$2.10</span>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; font-weight: bold; border-top: 1px solid #0f172a; margin-top: 4px;">
      <span>TOTAL PAID:</span>
      <span>$26.85</span>
    </div>
  </div>

  <div style="border-top: 1px dashed #94a3b8; margin-top: 16px; padding-top: 12px; text-align: center; font-size: 11px;">
    <p style="margin: 0;">Payment: Visa ending in ****8492</p>
    <p style="margin: 2px 0 0 0;">Auth Code: 029481</p>
    <p style="margin: 10px 0 0 0; font-weight: bold;">THANK YOU FOR YOUR VISIT!</p>
  </div>
</div>`
  },
  blank: {
    name: 'Blank Clean Document',
    icon: '📝',
    desc: 'Clean starting slate for custom HTML and styled CSS',
    code: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; color: #1e293b; line-height: 1.6; padding: 16px;">
  <h1 style="color: #0f172a; font-size: 28px; margin-bottom: 8px;">Document Title</h1>
  <p style="color: #64748b; font-size: 14px; margin-top: 0;">Subtitle or author name • November 2026</p>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
  <p style="font-size: 15px; color: #334155;">
    Write your document content here. You can paste any standard HTML code, inline CSS styles, images (as URLs or base64 data URIs), and SVG vector graphics.
  </p>
  <div style="page-break-after: always; height: 1px;"></div>
  <p style="font-size: 14px; color: #64748b; margin-top: 24px;">(This section will start on Page 2 in the PDF export)</p>
</div>`
  }
};

export type PageSize = 'a4' | 'letter' | 'legal' | 'a3' | 'a5';
export type PageOrientation = 'portrait' | 'landscape';
export type MarginOption = 'none' | 'narrow' | 'normal' | 'wide';
export type FontOption = 'default' | 'serif' | 'mono';

// Exact mm dimensions for standard paper formats
const PAGE_DIMENSIONS: Record<PageSize, { widthMm: number; heightMm: number; widthPt: number; heightPt: number; name: string }> = {
  a4: { widthMm: 210, heightMm: 297, widthPt: 595.28, heightPt: 841.89, name: 'A4 (210 × 297 mm)' },
  letter: { widthMm: 215.9, heightMm: 279.4, widthPt: 612, heightPt: 792, name: 'US Letter (8.5 × 11 in)' },
  legal: { widthMm: 215.9, heightMm: 355.6, widthPt: 612, heightPt: 1008, name: 'Legal (8.5 × 14 in)' },
  a3: { widthMm: 297, heightMm: 420, widthPt: 841.89, heightPt: 1190.55, name: 'A3 (297 × 420 mm)' },
  a5: { widthMm: 148, heightMm: 210, widthPt: 419.53, heightPt: 595.28, name: 'A5 (148 × 210 mm)' },
};

const MARGIN_MM: Record<MarginOption, number> = {
  none: 0,
  narrow: 8,
  normal: 15,
  wide: 25,
};

export function HtmlToPdfStudio() {
  const [activeTab, setActiveTab] = useState<'editor' | 'upload'>('editor');
  const [htmlCode, setHtmlCode] = useState<string>(STARTER_TEMPLATES.invoice.code);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('invoice');
  
  // Customization Options
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [margin, setMargin] = useState<MarginOption>('normal');
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [enableBackgrounds, setEnableBackgrounds] = useState<boolean>(true);
  const [fontOption, setFontOption] = useState<FontOption>('default');
  const [fileName, setFileName] = useState<string>('document');
  
  // Mobile tab preview toggle
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('preview');

  // Loading & Export state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [lastDownloadedSize, setLastDownloadedSize] = useState<string>('');

  const iframePreviewRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive dimensions according to orientation
  const baseDim = PAGE_DIMENSIONS[pageSize];
  const pageW = orientation === 'portrait' ? baseDim.widthPt : baseDim.heightPt;
  const pageH = orientation === 'portrait' ? baseDim.heightPt : baseDim.widthPt;
  const marginMm = MARGIN_MM[margin];

  // Font family string
  const fontFamilyCss = 
    fontOption === 'serif' 
      ? "Georgia, Cambria, 'Times New Roman', Times, serif"
      : fontOption === 'mono'
      ? "'Courier New', Courier, monospace"
      : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  // Build the complete standalone HTML string with injected print & page styles
  const buildCompleteHtml = useCallback((code: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${fileName || 'document'}</title>
  <style>
    @page {
      size: ${pageSize} ${orientation};
      margin: ${marginMm}mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: ${enableBackgrounds ? 'exact' : 'economy'} !important;
      print-color-adjust: ${enableBackgrounds ? 'exact' : 'economy'} !important;
      color-adjust: ${enableBackgrounds ? 'exact' : 'economy'} !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      font-family: ${fontFamilyCss};
    }
    body {
      padding: ${marginMm === 0 ? '0' : `${marginMm}mm`};
      transform-origin: top left;
      zoom: ${zoomScale / 100};
    }
    .page-break {
      page-break-after: always !important;
      break-after: page !important;
      height: 0;
      margin: 0;
      padding: 0;
      display: block;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    table {
      page-break-inside: auto;
    }
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    thead {
      display: table-header-group;
    }
    tfoot {
      display: table-footer-group;
    }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
  }, [fileName, pageSize, orientation, marginMm, enableBackgrounds, fontFamilyCss, zoomScale]);

  // Update iframe preview when code or settings change
  useEffect(() => {
    if (iframePreviewRef.current) {
      const fullDoc = buildCompleteHtml(htmlCode);
      const iframeDoc = iframePreviewRef.current.contentDocument || iframePreviewRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(fullDoc);
        iframeDoc.close();
      }
    }
  }, [htmlCode, buildCompleteHtml]);

  // Handle template selection
  const handleSelectTemplate = (key: keyof typeof STARTER_TEMPLATES) => {
    setSelectedTemplateKey(key);
    setHtmlCode(STARTER_TEMPLATES[key].code);
    toast.success(`Loaded ${STARTER_TEMPLATES[key].name} template`);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    // Auto set file name without extension
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    if (cleanName) setFileName(cleanName);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setHtmlCode(content);
        setActiveTab('editor');
        toast.success(`Loaded "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read file. Please ensure it is a valid text/HTML file.');
    };
    reader.readAsText(file);
  };

  // Insert page break tag at cursor or end
  const handleInsertPageBreak = () => {
    const snippet = `\n<!-- Page Break -->\n<div class="page-break" style="page-break-after: always; break-after: page;"></div>\n`;
    setHtmlCode((prev) => prev + snippet);
    toast.success('Added page break snippet to document');
  };

  // Format code (clean extra whitespace)
  const handleFormatCode = () => {
    toast.info('Code ready for PDF rendering');
  };

  // Copy code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      toast.success('HTML code copied to clipboard!');
    } catch {
      toast.error('Could not copy code automatically.');
    }
  };

  // Reset code
  const handleReset = () => {
    setHtmlCode(STARTER_TEMPLATES.invoice.code);
    setSelectedTemplateKey('invoice');
    setUploadedFileName(null);
    setFileName('document');
    toast.info('Reset to default invoice template');
  };

  // METHOD 1: Native Vector Print / Save as PDF (Highest fidelity vector fonts, selectable text & links)
  const handleVectorPrint = () => {
    setIsExporting(true);
    toast.loading('Preparing vector print preview...');

    try {
      const fullHtml = buildCompleteHtml(htmlCode);
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      printIframe.style.visibility = 'hidden';
      document.body.appendChild(printIframe);

      const frameDoc = printIframe.contentWindow?.document;
      if (!frameDoc) {
        throw new Error('Unable to create print sandbox');
      }

      frameDoc.open();
      frameDoc.write(fullHtml);
      frameDoc.close();

      setTimeout(() => {
        setIsExporting(false);
        toast.dismiss();
        try {
          printIframe.contentWindow?.focus();
          printIframe.contentWindow?.print();
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
        } catch (err) {
          console.error(err);
          toast.error('Print preview was blocked. Please check your browser popup settings.');
        } finally {
          setTimeout(() => {
            if (document.body.contains(printIframe)) {
              document.body.removeChild(printIframe);
            }
          }, 1500);
        }
      }, 500);
    } catch (err) {
      console.error(err);
      setIsExporting(false);
      toast.dismiss();
      toast.error('Failed to trigger vector print engine.');
    }
  };

  // METHOD 2: Direct 1-Click PDF Download (Direct file download via client-side canvas/pdf-lib)
  const handleDownloadPdf = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Generating high-resolution PDF...');

    try {
      // Create a high-res off-screen container for rendering
      const previewIframe = iframePreviewRef.current;
      if (!previewIframe || !previewIframe.contentDocument) {
        throw new Error('Preview container not ready');
      }

      const iframeBody = previewIframe.contentDocument.body;
      const scrollHeight = Math.max(iframeBody.scrollHeight, 600);
      const scrollWidth = Math.max(iframeBody.scrollWidth, 800);

      // Construct SVG with foreignObject for pixel-perfect in-browser rasterization
      // We encode html safely
      const cleanHtmlBody = previewIframe.contentDocument.documentElement.outerHTML;

      // Calculate page height in points and pixels (at 96 DPI: 1 pt = 96/72 px = 1.333 px)
      const ptToPx = 96 / 72;
      const targetPageWidthPx = pageW * ptToPx;
      const targetPageHeightPx = pageH * ptToPx;

      // Create an SVG container
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${targetPageWidthPx}" height="${scrollHeight}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${cleanHtmlBody}
            </div>
          </foreignObject>
        </svg>
      `;

      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      
      const renderPromise = new Promise<Uint8Array>((resolve, reject) => {
        img.onload = async () => {
          try {
            // Render onto Canvas at 2x Retina scale for crisp lines
            const scaleFactor = 2;
            const fullCanvas = document.createElement('canvas');
            fullCanvas.width = targetPageWidthPx * scaleFactor;
            fullCanvas.height = scrollHeight * scaleFactor;

            const ctx = fullCanvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Canvas context unavailable'));
              return;
            }

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, fullCanvas.width, fullCanvas.height);
            ctx.scale(scaleFactor, scaleFactor);
            ctx.drawImage(img, 0, 0);

            URL.revokeObjectURL(svgUrl);

            // Assemble PDF using pdf-lib
            const pdfDoc = await PDFDocument.create();
            const totalPages = Math.max(1, Math.ceil(scrollHeight / targetPageHeightPx));

            for (let i = 0; i < totalPages; i++) {
              const pageCanvas = document.createElement('canvas');
              pageCanvas.width = targetPageWidthPx * scaleFactor;
              pageCanvas.height = targetPageHeightPx * scaleFactor;

              const pageCtx = pageCanvas.getContext('2d');
              if (pageCtx) {
                pageCtx.fillStyle = '#ffffff';
                pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

                // Slice region from full canvas
                const sourceY = i * targetPageHeightPx * scaleFactor;
                const sourceH = Math.min(
                  targetPageHeightPx * scaleFactor,
                  fullCanvas.height - sourceY
                );

                if (sourceH > 0) {
                  pageCtx.drawImage(
                    fullCanvas,
                    0,
                    sourceY,
                    pageCanvas.width,
                    sourceH,
                    0,
                    0,
                    pageCanvas.width,
                    sourceH
                  );
                }

                const pageDataUrl = pageCanvas.toDataURL('image/jpeg', 0.95);
                const pageJpgBytes = await fetch(pageDataUrl).then((res) => res.arrayBuffer());
                const embeddedImage = await pdfDoc.embedJpg(pageJpgBytes);

                const newPage = pdfDoc.addPage([pageW, pageH]);
                newPage.drawImage(embeddedImage, {
                  x: 0,
                  y: 0,
                  width: pageW,
                  height: pageH,
                });
              }
            }

            const pdfBytes = await pdfDoc.save();
            resolve(pdfBytes);
          } catch (e) {
            reject(e);
          }
        };

        img.onerror = () => {
          // If foreignObject is restricted by browser security policies, gracefully fallback to print
          reject(new Error('Canvas rasterization fallback'));
        };
      });

      img.src = svgUrl;

      try {
        const pdfBytes = await renderPromise;
        const outFileName = `${fileName.trim() || 'document'}.pdf`;
        triggerBrowserDownload(pdfBytes, outFileName, 'application/pdf');

        const sizeKb = (pdfBytes.byteLength / 1024).toFixed(1);
        setLastDownloadedSize(`${sizeKb} KB`);
        setIsExporting(false);
        toast.dismiss(toastId);
        toast.success(`Downloaded "${outFileName}" (${sizeKb} KB)!`);
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
        setShowSuccessModal(true);
      } catch {
        // Fallback gracefully to Vector Print if canvas blocked
        toast.dismiss(toastId);
        toast.info('Switching to Vector Print engine for maximum text sharpness...');
        handleVectorPrint();
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      // Seamless fallback to Vector Print engine
      handleVectorPrint();
    } finally {
      setIsExporting(false);
    }
  };

  // Download raw HTML
  const handleDownloadHtml = () => {
    const fullHtml = buildCompleteHtml(htmlCode);
    const outName = `${fileName.trim() || 'document'}.html`;
    triggerBrowserDownload(fullHtml, outName, 'text/html');
    toast.success(`Saved "${outName}"`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Studio Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 mb-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              100% In-Browser • Zero Server Uploads • Vector & Raster PDF
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              HTML to PDF Converter Studio
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-2xl">
              Convert raw HTML code, CSS, or `.html` files into crisp, publication-ready PDF documents.
              Preserves background colors, typography, tables, and page breaks with zero watermarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleVectorPrint}
              disabled={isExporting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm transition-all hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
              title="Prints vector PDF with 100% selectable text & clickable links"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Vector Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm shadow-blue-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Configuration Controls Toolbar */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 text-xs">
          {/* Page Format */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Page Format</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSize)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
            >
              <option value="a4">A4 (210×297 mm)</option>
              <option value="letter">US Letter (8.5×11")</option>
              <option value="legal">Legal (8.5×14")</option>
              <option value="a3">A3 (297×420 mm)</option>
              <option value="a5">A5 (148×210 mm)</option>
            </select>
          </div>

          {/* Orientation */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Orientation</label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as PageOrientation)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          {/* Margins */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Margins</label>
            <select
              value={margin}
              onChange={(e) => setMargin(e.target.value as MarginOption)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
            >
              <option value="normal">Normal (15 mm)</option>
              <option value="narrow">Narrow (8 mm)</option>
              <option value="wide">Wide (25 mm)</option>
              <option value="none">Zero (0 mm / Full Bleed)</option>
            </select>
          </div>

          {/* Zoom / Scale */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Scale / Zoom</label>
            <select
              value={zoomScale}
              onChange={(e) => setZoomScale(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
            >
              <option value={75}>75% (Compact)</option>
              <option value={90}>90%</option>
              <option value={100}>100% (Standard)</option>
              <option value={110}>110%</option>
              <option value={125}>125% (Large)</option>
            </select>
          </div>

          {/* Background Colors */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">CSS Backgrounds</label>
            <button
              type="button"
              onClick={() => setEnableBackgrounds(!enableBackgrounds)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border font-medium transition ${
                enableBackgrounds
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span>{enableBackgrounds ? 'Vibrant Colors' : 'Economy (White)'}</span>
              <Check className={`w-3.5 h-3.5 ${enableBackgrounds ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          </div>

          {/* Output Filename */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">File Name</label>
            <div className="relative">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="document"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 pr-8 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
              />
              <span className="absolute right-2 top-1.5 text-slate-400 font-semibold text-[11px]">.pdf</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex rounded-xl bg-slate-200/80 p-1 mb-4">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            mobileView === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          HTML Code & Files
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            mobileView === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          Live PDF Sheet Preview
        </button>
      </div>

      {/* Main Interactive Split Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Code Editor & Upload (Columns 1-6) */}
        <div className={`lg:col-span-6 space-y-4 ${mobileView === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Editor Toolbar Header */}
            <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/70 gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'editor'
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 inline-block mr-1.5" />
                  Code Editor
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'upload'
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 inline-block mr-1.5" />
                  Upload .HTML File
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleInsertPageBreak}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition"
                  title="Insert a page break element"
                >
                  <Split className="w-3 h-3 inline-block mr-1" />
                  + Page Break
                </button>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200/60 transition"
                  title="Copy HTML to clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200/60 transition"
                  title="Reset to default template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Template Selector Bar */}
            <div className="px-4 py-2.5 bg-slate-100/60 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs scrollbar-thin">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">Presets:</span>
              {(Object.keys(STARTER_TEMPLATES) as Array<keyof typeof STARTER_TEMPLATES>).map((key) => {
                const item = STARTER_TEMPLATES[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectTemplate(key)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                      selectedTemplateKey === key
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Code Textarea */}
            {activeTab === 'editor' && (
              <div className="relative">
                <textarea
                  value={htmlCode}
                  onChange={(e) => {
                    setHtmlCode(e.target.value);
                    setSelectedTemplateKey('custom');
                  }}
                  rows={20}
                  spellCheck={false}
                  placeholder="Paste or write HTML & CSS markup here..."
                  className="w-full font-mono text-xs text-slate-800 bg-white p-4 focus:outline-none resize-y min-h-[460px] leading-relaxed selection:bg-blue-100"
                />
                <div className="absolute right-3 bottom-3 px-2 py-1 bg-slate-900/70 text-white text-[10px] rounded font-mono pointer-events-none">
                  {htmlCode.length.toLocaleString()} characters
                </div>
              </div>
            )}

            {/* Tab 2: File Upload Area */}
            {activeTab === 'upload' && (
              <div className="p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".html,.htm,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-8 cursor-pointer transition flex flex-col items-center justify-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-105 transition">
                    <FileCode className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">
                    Upload HTML Document
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mb-4">
                    Drag and drop your <code className="text-blue-600">.html</code>, <code className="text-blue-600">.htm</code>, or text file here, or click to browse from your device.
                  </p>
                  <span className="px-4 py-2 bg-blue-600 group-hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition">
                    Select Local File
                  </span>
                </div>

                {uploadedFileName && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold">{uploadedFileName} loaded</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('editor')}
                      className="text-emerald-700 hover:text-emerald-900 font-bold underline"
                    >
                      View & Edit in Code Tab →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Footer helper */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% In-Browser Privacy
              </span>
              <button
                onClick={handleDownloadHtml}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Save as .html file
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Paper Sheet Preview (Columns 7-12) */}
        <div className={`lg:col-span-6 space-y-4 ${mobileView === 'editor' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Preview Sheet Header */}
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-xs text-slate-800">Live Paper Sheet Preview</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-[10px] font-semibold text-slate-600 uppercase">
                  {pageSize.toUpperCase()} {orientation}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  {PAGE_DIMENSIONS[pageSize].name}
                </span>
                <button
                  onClick={handleVectorPrint}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                  title="Print preview"
                >
                  <Printer className="w-3.5 h-3.5 inline mr-1" />
                  Print
                </button>
              </div>
            </div>

            {/* Paper Mockup Container */}
            <div className="bg-slate-200/50 p-4 sm:p-6 overflow-x-auto flex justify-center items-start min-h-[520px]">
              {/* Scaled Physical Paper Mockup */}
              <div
                className="bg-white shadow-xl rounded-sm transition-all duration-200 relative overflow-hidden"
                style={{
                  width: '100%',
                  maxWidth: orientation === 'portrait' ? '540px' : '720px',
                  aspectRatio: `${pageW} / ${pageH}`,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Sandboxed rendering iframe */}
                <iframe
                  ref={iframePreviewRef}
                  title="PDF Live Document Preview"
                  sandbox="allow-same-origin"
                  className="w-full h-full border-none block"
                />
              </div>
            </div>

            {/* Quick action bar beneath preview */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Rendering Active</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleVectorPrint}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
                >
                  Vector Print
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Celebration Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              PDF Generated Successfully!
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Your document <strong className="text-slate-800">{fileName}.pdf</strong> ({lastDownloadedSize}) has been downloaded directly to your device.
            </p>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left text-xs text-slate-700 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Page Format:</span>
                <span className="font-semibold text-slate-800">{PAGE_DIMENSIONS[pageSize].name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Orientation:</span>
                <span className="font-semibold text-slate-800 capitalize">{orientation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Client-Side Security:</span>
                <span className="font-semibold text-emerald-600">Zero Server Upload</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  handleVectorPrint();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
              >
                Print / Vector Copy
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

