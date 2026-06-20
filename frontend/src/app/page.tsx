import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-block p-4 mb-6 rounded-full bg-blue-900/30 border border-blue-800/50">
        <span className="text-4xl" aria-hidden="true">🌍</span>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
        Take Control of Your <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Carbon Footprint
        </span>
      </h1>
      
      <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
        EcoCarbon helps you understand, track, and reduce your daily emissions. 
        Log your commute, diet, and energy usage to receive personalized, 
        actionable insights tailored to your lifestyle.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/log" 
          className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
        >
          Get Started
          <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-300 transition-all bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500"
        >
          View Demo Dashboard
        </Link>
      </div>

      {/* Quick Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left border-t border-slate-800 pt-16">
        <div>
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800 text-blue-400 mb-4 border border-slate-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">Track Daily</h3>
          <p className="text-slate-400 text-sm">Quickly log your meals, transport, and energy use with our streamlined interface.</p>
        </div>
        <div>
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800 text-emerald-400 mb-4 border border-slate-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">Analyze Data</h3>
          <p className="text-slate-400 text-sm">Understand your highest emission categories with interactive, accessible charts.</p>
        </div>
        <div>
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800 text-amber-400 mb-4 border border-slate-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">Take Action</h3>
          <p className="text-slate-400 text-sm">Receive personalized, actionable recommendations to effectively reduce your footprint.</p>
        </div>
      </div>
    </div>
  );
}
