'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DashboardData {
  baseline_emissions_kg: number;
  activity_emissions_kg: number;
  total_emissions_kg: number;
  baseline_breakdown: {
    COMMUTE: number;
    DIET: number;
    ENERGY: number;
    LIFESTYLE_OVERHEAD: number;
  };
  activity_breakdown: {
    COMMUTE: number;
    DIET: number;
    ENERGY: number;
  };
  priority_insight: string | null;
}

const COLORS = {
  COMMUTE: '#3b82f6', // blue-500
  DIET: '#10b981',    // emerald-500
  ENERGY: '#f59e0b',  // amber-500
  LIFESTYLE_OVERHEAD: '#8b5cf6', // violet-500
};

export default function InsightsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Simulation of network request to backend
        setTimeout(() => {
          setData({
            baseline_emissions_kg: 575.0,
            activity_emissions_kg: 35.5,
            total_emissions_kg: 610.5,
            baseline_breakdown: {
              COMMUTE: 250.0,
              DIET: 150.0,
              ENERGY: 75.0,
              LIFESTYLE_OVERHEAD: 100.0
            },
            activity_breakdown: {
              COMMUTE: 15.0,
              DIET: 10.5,
              ENERGY: 10.0
            },
            priority_insight: "Carpooling twice a week can instantly reduce your transportation emissions by 30%."
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to load dashboard insights.');
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64 border border-slate-800 rounded-xl bg-slate-800/30 text-slate-400 animate-pulse">Calculating footprint...</div>;
  if (error || !data) return <div className="p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-200">{error || 'No data available.'}</div>;

  const baselineChartData = Object.entries(data.baseline_breakdown)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({ name: key.replace('_', ' '), value, category: key }));

  const activityChartData = Object.entries(data.activity_breakdown)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({ name: key, value, category: key }));

  return (
    <div className="space-y-6">
      
      {/* High Level KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Estimated Monthly Baseline</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">{data.baseline_emissions_kg.toFixed(1)}</span>
            <span className="text-sm font-medium text-slate-400">kg CO₂e</span>
          </div>
        </div>
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Logged Activities Impact</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-blue-400">+{data.activity_emissions_kg.toFixed(1)}</span>
            <span className="text-sm font-medium text-slate-400">kg CO₂e</span>
          </div>
        </div>
        <div className="p-6 bg-blue-900/20 rounded-xl shadow-lg border border-blue-800/50">
          <h2 className="text-sm font-medium text-blue-300 uppercase tracking-wider">Total Combined Footprint</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">{data.total_emissions_kg.toFixed(1)}</span>
            <span className="text-sm font-medium text-blue-300">kg CO₂e</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Baseline Chart */}
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-100 mb-2">Monthly Baseline Profile</h2>
          <p className="text-xs text-slate-400 mb-4">Calculated from your static onboarding demographics.</p>
          <div className="flex-1 min-h-[250px]" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={baselineChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                  {baselineChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.category as keyof typeof COLORS]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activities Chart */}
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-100 mb-2">Logged Activities</h2>
          <p className="text-xs text-slate-400 mb-4">Direct emissions from the activities you've logged.</p>
          {activityChartData.length > 0 ? (
            <div className="flex-1 min-h-[250px]" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activityChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                    {activityChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.category as keyof typeof COLORS]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">No activities logged yet.</div>
          )}
        </div>

      </div>

      {/* Insight Engine */}
      <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700" style={{ borderLeftWidth: '4px', borderLeftColor: COLORS.LIFESTYLE_OVERHEAD }}>
        <h2 className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: COLORS.LIFESTYLE_OVERHEAD }}>AI Priority Insight</h2>
        <h3 className="text-xl font-bold text-white mb-4">Personalized Recommendation</h3>
        
        <div className="flex gap-3 text-sm text-slate-200 bg-slate-900/60 p-4 rounded-lg border border-slate-700/50">
          <span aria-hidden="true" style={{ color: COLORS.LIFESTYLE_OVERHEAD }} className="text-xl">✨</span>
          <span className="leading-relaxed font-medium">
            {data.priority_insight || "Log more activities to generate your personalized AI insight."}
          </span>
        </div>
      </div>
    </div>
  );
}
