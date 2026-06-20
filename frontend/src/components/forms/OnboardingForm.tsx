'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State maps directly to the updated FastAPI UserCreate schema
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    household_size: 1,
    lifestyle_type: '',
    diet_preference: '',
    energy_habits: '',
    transportation_habits: '',
    full_name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'household_size' ? parseInt(value) || 1 : value
    }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/v1/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Registration failed. Please check your inputs.');
      }

      // Success - Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} 
      className="p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 space-y-8"
      aria-label="Multi-step Onboarding Form"
    >
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step >= item ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-700 text-slate-400'}`}>
              {item}
            </div>
            {item < 4 && (
              <div className={`w-12 sm:w-24 h-1 mx-2 rounded transition-colors ${step > item ? 'bg-blue-600' : 'bg-slate-700'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-200 text-sm" role="alert">
          {error}
        </div>
      )}

      {/* STEP 1: Demographics */}
      {step === 1 && (
        <fieldset className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <legend className="text-xl font-semibold text-slate-100 mb-2">Location & Household</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label htmlFor="country" className="block text-sm font-medium text-slate-300">Country *</label>
              <input type="text" id="country" name="country" required value={formData.country} onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="city" className="block text-sm font-medium text-slate-300">City *</label>
              <input type="text" id="city" name="city" required value={formData.city} onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="household_size" className="block text-sm font-medium text-slate-300">Household Size *</label>
            <input type="number" id="household_size" name="household_size" min="1" required value={formData.household_size} onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
          </div>
        </fieldset>
      )}

      {/* STEP 2: Lifestyle & Diet */}
      {step === 2 && (
        <fieldset className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <legend className="text-xl font-semibold text-slate-100 mb-2">Lifestyle & Diet</legend>
          <div className="space-y-1.5">
            <label htmlFor="lifestyle_type" className="block text-sm font-medium text-slate-300">Lifestyle Type *</label>
            <select id="lifestyle_type" name="lifestyle_type" required value={formData.lifestyle_type} onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
              <option value="">Select...</option>
              <option value="Active">Active (Frequent travel/outdoors)</option>
              <option value="Moderate">Moderate</option>
              <option value="Sedentary">Sedentary (Mostly at home)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="diet_preference" className="block text-sm font-medium text-slate-300">Primary Diet *</label>
            <select id="diet_preference" name="diet_preference" required value={formData.diet_preference} onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
              <option value="">Select...</option>
              <option value="HIGH_MEAT">High Meat</option>
              <option value="MEDIUM_MEAT">Medium Meat</option>
              <option value="LOW_MEAT">Low Meat</option>
              <option value="PESCATARIAN">Pescatarian</option>
              <option value="VEGETARIAN">Vegetarian</option>
              <option value="VEGAN">Vegan</option>
            </select>
          </div>
        </fieldset>
      )}

      {/* STEP 3: Energy & Transport */}
      {step === 3 && (
        <fieldset className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <legend className="text-xl font-semibold text-slate-100 mb-2">Energy & Transportation</legend>
          <div className="space-y-1.5">
            <label htmlFor="energy_habits" className="block text-sm font-medium text-slate-300">Home Energy Usage *</label>
            <select id="energy_habits" name="energy_habits" required value={formData.energy_habits} onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
              <option value="">Select...</option>
              <option value="High">High (Always running AC/Heat)</option>
              <option value="Average">Average</option>
              <option value="Low">Low (Energy conscious)</option>
              <option value="Renewable">100% Renewable</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="transportation_habits" className="block text-sm font-medium text-slate-300">Primary Transportation *</label>
            <select id="transportation_habits" name="transportation_habits" required value={formData.transportation_habits} onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
              <option value="">Select...</option>
              <option value="Car (Gasoline)">Car (Gasoline)</option>
              <option value="Car (Electric)">Car (Electric)</option>
              <option value="Public Transit">Public Transit (Bus/Train)</option>
              <option value="Bicycle/Walking">Bicycle / Walking</option>
            </select>
          </div>
        </fieldset>
      )}

      {/* STEP 4: Account Details */}
      {step === 4 && (
        <fieldset className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <legend className="text-xl font-semibold text-slate-100 mb-2">Account Creation</legend>
          <div className="space-y-1.5">
            <label htmlFor="full_name" className="block text-sm font-medium text-slate-300">Full Name</label>
            <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email Address *</label>
            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password *</label>
            <input type="password" id="password" name="password" minLength={8} required value={formData.password} onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
            <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters long.</p>
          </div>
        </fieldset>
      )}

      {/* Form Controls */}
      <div className="flex gap-4 pt-4 border-t border-slate-700">
        {step > 1 && (
          <button type="button" onClick={handleBack} disabled={loading} className="w-1/3 py-3 px-4 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            Back
          </button>
        )}
        <button type="submit" disabled={loading} aria-disabled={loading} className={`${step === 1 ? 'w-full' : 'flex-1'} py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 disabled:opacity-50 transition-colors`}>
          {step < 4 ? 'Continue' : loading ? 'Creating Profile...' : 'Complete Registration'}
        </button>
      </div>
    </form>
  );
}
