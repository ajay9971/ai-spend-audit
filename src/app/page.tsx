import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1 text-emerald-400 text-sm font-medium mb-6">
          Free AI Spend Audit
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Are you overpaying for
          <span className="text-emerald-400"> AI tools?</span>
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Most startups overspend on AI subscriptions by 30–40%. 
          Get a free, instant audit of your stack — no login required.
        </p>
        <Link href="/audit">
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg px-8 py-6">
            Audit My AI Spend →
          </Button>
        </Link>
        <p className="text-slate-500 text-sm mt-4">Takes 2 minutes. No login needed.</p>
      </div>

      {/* Social Proof */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-center border-t border-slate-700">
        <p className="text-slate-400 text-sm mb-6">TRUSTED BY TEAMS AT</p>
        <div className="flex justify-center gap-12 text-slate-500 font-medium">
          <span>Early-stage startups</span>
          <span>Engineering teams</span>
          <span>Indie hackers</span>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Enter your tools', desc: 'Tell us what AI tools you pay for, which plan, and how many seats.' },
            { step: '2', title: 'Get your audit', desc: 'Our engine analyzes your spend and finds overspend in seconds.' },
            { step: '3', title: 'Save money', desc: 'See exactly what to switch, downgrade, or cut — with real numbers.' },
          ].map((item) => (
            <div key={item.step} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="text-emerald-400 font-bold text-2xl mb-3">0{item.step}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}