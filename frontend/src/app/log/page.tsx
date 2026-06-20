import { Metadata } from 'next';
import LogActivityForm from '@/components/forms/LogActivityForm';

export const metadata: Metadata = {
  title: 'Log Activity | Eco Carbon',
};

export default function LogPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">Daily Log</h1>
        <p className="text-slate-400 mt-2 text-sm">
          Securely record your commute, diet, or energy consumption to update your footprint insights.
        </p>
      </header>
      
      <section aria-labelledby="form-heading">
        <h2 id="form-heading" className="sr-only">Activity Input Form</h2>
        <LogActivityForm />
      </section>
    </div>
  );
}
