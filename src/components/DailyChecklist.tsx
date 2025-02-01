import { useState } from 'react';

interface ChecklistState {
  weight?: number;
  visaCheck: boolean | null;
  publishedWriting: boolean;
}

export default function DailyChecklist() {
  const [weight, setWeight] = useState<number | ''>('');
  const [visaCheck, setVisaCheck] = useState<boolean | null>(null);
  const [publishedWriting, setPublishedWriting] = useState(false);

  // Mock data - replace with real data later
  const hasEnteredWeightToday = false;
  const hasCheckedVisaToday = false;
  const hasPublishedThisWeek = false;

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle weight submission here
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Daily Checklist</h2>
      
      <div className="space-y-6">
        {/* Weight Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Today's Weight</h3>
          {hasEnteredWeightToday ? (
            <div className="text-green-600">✓ Recorded for today</div>
          ) : (
            <form onSubmit={handleWeightSubmit} className="flex gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || '')}
                placeholder="Enter weight"
                className="border rounded px-3 py-2 w-32"
                step="0.1"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </form>
          )}
        </div>

        {/* Visa Check Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Visa Status Check</h3>
          {hasCheckedVisaToday ? (
            <div className="text-green-600">✓ Checked for today</div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => setVisaCheck(true)}
                className={`px-4 py-2 rounded ${
                  visaCheck === true
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Open Loop
              </button>
              <button
                onClick={() => setVisaCheck(false)}
                className={`px-4 py-2 rounded ${
                  visaCheck === false
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                All Clear
              </button>
            </div>
          )}
        </div>

        {/* Writing Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Writing Publication</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPublishedWriting(!publishedWriting)}
              className={`px-4 py-2 rounded ${
                publishedWriting
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {publishedWriting ? "Published Today!" : "Published Today?"}
            </button>
            <span className="text-sm text-gray-600">
              {hasPublishedThisWeek
                ? "✓ Published this week"
                : "No publications this week yet"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 