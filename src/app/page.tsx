'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Layout, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [flows, setFlows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFlows();
  }, []);

  const fetchFlows = async () => {
    try {
      const res = await fetch('/api/flows');
      if (res.ok) {
        const data = await res.json();
        setFlows(data.flows || []); // Assuming API returns { flows: [] }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createNewFlow = async () => {
    try {
      const res = await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: [],
          edges: [],
          title: `New Flow ${new Date().toLocaleDateString()}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.id) {
          router.push(`/flow/${data.id}`);
        }
      }
    } catch (e) {
      console.error("Failed to create flow", e);
    }
  };

  return (
    <main className="min-h-screen w-full p-8 relative z-10 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="font-serif text-4xl font-bold text-white mb-2">My Flows</h1>
            <p className="text-gray-400">Manage your automation workflows</p>
          </div>
          <button
            onClick={createNewFlow}
            className="bg-teal-accent hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-teal-accent/20"
          >
            <Plus className="w-5 h-5" />
            New Flow
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-teal-accent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card (Visual) */}
            <button
              onClick={createNewFlow}
              className="group relative h-48 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-accent/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all text-gray-400 hover:text-white border-dashed"
            >
              <div className="p-4 rounded-full bg-white/5 group-hover:bg-teal-accent/20 group-hover:text-teal-accent transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-medium">Create New Flow</span>
            </button>

            {flows.map((flow) => (
              <Link
                key={flow.id}
                href={`/flow/${flow.id}`}
                className="group h-48 bg-black/40 backdrop-blur-md border border-white/10 hover:border-teal-accent/50 rounded-2xl p-6 flex flex-col justify-between transition-all hover:transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-teal-accent/10 text-teal-accent">
                    <Layout className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{flow.title || `Flow #${flow.id}`}</h3>
                  <p className="text-xs text-gray-500">Last updated: {new Date(flow.updated_at).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
