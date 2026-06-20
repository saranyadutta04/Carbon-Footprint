import { Metadata } from 'next';
import InsightsDashboard from '@/components/dashboard/InsightsDashboard';

export const metadata: Metadata = {
  title: 'Dashboard Insights | Eco Carbon',
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">Your Insights</h1>
        <p className="text-slate-400 mt-2 text-sm">
          Analyze your carbon footprint and discover personalized, high-impact ways to reduce your emissions.
        </p>
      </header>
      
      {/* Main Client Component handling state and visualizations */}
      <InsightsDashboard />
    </div>
  );
}
