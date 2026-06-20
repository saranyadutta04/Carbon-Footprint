import { Metadata } from 'next';
import OnboardingForm from '@/components/forms/OnboardingForm';

export const metadata: Metadata = {
  title: 'Onboarding | Eco Carbon',
};

export default function OnboardingPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Welcome to EcoCarbon</h1>
        <p className="text-slate-400 text-lg">
          Let's set up your profile to generate your initial footprint estimate.
        </p>
      </header>
      
      <section aria-labelledby="form-heading">
        <h2 id="form-heading" className="sr-only">Onboarding Form</h2>
        <OnboardingForm />
      </section>
    </div>
  );
}
