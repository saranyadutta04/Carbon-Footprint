'use client';

import React, { useState } from 'react';

// Mirrors the strict typing established in the FastAPI backend
type Category = 'COMMUTE' | 'DIET' | 'ENERGY';

export default function LogActivityForm() {
  const [category, setCategory] = useState<Category>('COMMUTE');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // API Call simulation placeholder
    setTimeout(() => {
      setLoading(false);
      alert('Activity logged successfully!');
    }, 1000);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 space-y-6"
      aria-label="Log Daily Carbon Activity Form"
    >
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-slate-100 mb-2">
          Activity Details
        </legend>

        {/* Dynamic Category Selection */}
        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-sm font-medium text-slate-300">
            Activity Category <span aria-hidden="true" className="text-red-400">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            required
            aria-required="true"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="COMMUTE">Commute</option>
            <option value="DIET">Diet</option>
            <option value="ENERGY">Energy Consumption</option>
          </select>
        </div>

        {/* Conditional Rendering: Commute Fields */}
        {category === 'COMMUTE' && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="distance_km" className="block text-sm font-medium text-slate-300">
                Distance (km) <span aria-hidden="true" className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="distance_km"
                name="distance_km"
                min="0.1"
                step="0.1"
                required
                aria-required="true"
                placeholder="e.g. 15.5"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="transport_mode" className="block text-sm font-medium text-slate-300">
                Transport Mode <span aria-hidden="true" className="text-red-400">*</span>
              </label>
              <select
                id="transport_mode"
                name="transport_mode"
                required
                aria-required="true"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select mode...</option>
                <option value="CAR_GASOLINE">Car (Gasoline)</option>
                <option value="CAR_ELECTRIC">Car (Electric)</option>
                <option value="BUS">Bus</option>
                <option value="TRAIN">Train</option>
                <option value="BICYCLE">Bicycle</option>
                <option value="WALKING">Walking</option>
              </select>
            </div>
          </div>
        )}

        {/* Conditional Rendering: Diet Fields */}
        {category === 'DIET' && (
          <div className="space-y-1.5 pt-2">
            <label htmlFor="diet_type" className="block text-sm font-medium text-slate-300">
              Diet Type <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <select
              id="diet_type"
              name="diet_type"
              required
              aria-required="true"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">Select diet type...</option>
              <option value="HIGH_MEAT">High Meat (&gt;100g/day)</option>
              <option value="MEDIUM_MEAT">Medium Meat (50-100g/day)</option>
              <option value="LOW_MEAT">Low Meat (&lt;50g/day)</option>
              <option value="PESCATARIAN">Pescatarian</option>
              <option value="VEGETARIAN">Vegetarian</option>
              <option value="VEGAN">Vegan</option>
            </select>
          </div>
        )}

        {/* Conditional Rendering: Energy Fields */}
        {category === 'ENERGY' && (
          <div className="space-y-1.5 pt-2">
            <label htmlFor="energy_kwh" className="block text-sm font-medium text-slate-300">
              Energy Consumed (kWh) <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <input
              type="number"
              id="energy_kwh"
              name="energy_kwh"
              min="0.1"
              step="0.1"
              required
              aria-required="true"
              placeholder="e.g. 10.5"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        aria-disabled={loading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Submitting...' : 'Save Activity'}
      </button>
    </form>
  );
}
