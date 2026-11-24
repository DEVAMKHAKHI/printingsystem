import { useState } from 'react';
import { Check, Copy, Database, ShieldCheck } from 'lucide-react';
import firestoreRulesText from '../../android-project/firestore.rules?raw';
import { DUMMY_CUSTOMERS } from '../data/dummyCustomers';

export function FirebaseGuideView() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyText(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard fallback ignored in restricted headless contexts
    }
  }

  const setupSteps = [
    {
      step: '01. Create a Firebase Project',
      detail:
        'Open console.firebase.google.com, click "Add project", enter "PrintCare", optionally disable Google Analytics for faster setup, and click "Create project".',
    },
    {
      step: '02. Register the Android Application',
      detail:
        'Click the Android icon on Project Overview. Enter Android package name "com.printcare.app" and app nickname "PrintCare". Download the generated google-services.json file.',
    },
    {
      step: '03. Add google-services.json to Android Studio',
      detail:
        'Switch Android Studio to Project view and place google-services.json directly inside the app/ directory (PrintCare/app/google-services.json). Never commit real credentials to public repositories.',
    },
    {
      step: '04. Enable Email/Password Authentication',
      detail:
        'In Firebase Console, open Build -> Authentication -> Get Started -> Sign-in method -> Email/Password -> Enable -> Save. Optionally add your first test staff user under the Users tab.',
    },
    {
      step: '05. Create Cloud Firestore Database',
      detail:
        'Open Build -> Firestore Database -> Create database -> Start in production mode -> select region asia-south1 (Mumbai) for lowest latency in India -> Enable.',
    },
    {
      step: '06. Publish Secure Firestore Rules',
      detail:
        'In Firestore Database -> Rules tab, paste the firestore.rules configuration below and click Publish. It enforces request.auth != null and validates all 7 customer fields.',
    },
  ];

  const dummyJsonString = JSON.stringify(DUMMY_CUSTOMERS, null, 2);

  return (
    <div className="space-y-6">
      {/* Setup Checklist Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <Database className="w-5 h-5 text-blue-700" />
          <h2 className="text-lg font-bold text-slate-900">
            Firebase Setup & Android Studio Connection Guide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {setupSteps.map((item) => (
            <div key={item.step} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">{item.step}</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Firestore Rules */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">firestore.rules (Security Rules)</h3>
              <p className="text-xs text-slate-600">
                Requires Firebase Authentication and validates customerId, 10-digit Indian phone, DOB, email, address, and timestamp.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => copyText('rules', firestoreRulesText)}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            {copiedId === 'rules' ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedId === 'rules' ? 'Copied Rules' : 'Copy Rules'}
          </button>
        </div>
        <pre className="bg-slate-950 text-slate-100 p-5 text-xs font-mono overflow-x-auto leading-relaxed">
          {firestoreRulesText}
        </pre>
      </div>

      {/* Dummy Data Table & Manual Insertion Guide */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              10 Realistic Indian Customer Dummy Records
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Collection: <code className="font-mono bg-slate-100 px-1 rounded">customers</code> · Use Document ID matching <code className="font-mono bg-slate-100 px-1 rounded">customerId</code> and Timestamp type for <code className="font-mono bg-slate-100 px-1 rounded">createdAt</code>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => copyText('all-json', dummyJsonString)}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            {copiedId === 'all-json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedId === 'all-json' ? 'Copied JSON' : 'Copy All 10 Records (JSON)'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">DOB</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4 text-right">Copy Doc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {DUMMY_CUSTOMERS.map((cust) => (
                <tr key={cust.customerId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-900 whitespace-nowrap">{cust.customerId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{cust.name}</td>
                  <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap">{cust.phone}</td>
                  <td className="py-3 px-4 tabular-nums whitespace-nowrap">{cust.dob}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{cust.email}</td>
                  <td className="py-3 px-4 max-w-xs truncate" title={cust.address}>{cust.address}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => copyText(cust.customerId, JSON.stringify(cust, null, 2))}
                      className="px-2.5 py-1 border border-slate-200 hover:bg-slate-100 rounded-md text-[11px] font-medium inline-flex items-center gap-1"
                    >
                      {copiedId === cust.customerId ? (
                        <Check className="w-3 h-3 text-green-700" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copiedId === cust.customerId ? 'Copied' : 'JSON'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
