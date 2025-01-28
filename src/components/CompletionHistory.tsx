import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Task {
  status: string;
  dateCompleted?: string;
}

interface CompletionHistoryProps {
  tasks: Task[];
}

export default function CompletionHistory({ tasks }: CompletionHistoryProps) {
  // Get last 7 days (including today)
  const getDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // Format date in YYYY-MM-DD format to match Airtable
      const dateStr = d.toISOString().split('T')[0];
      dates.push(dateStr);
    }
    return dates;
  };

  // Process task data
  const chartData = getDates().map(date => {
    const completions = tasks.filter(
      task => task.status === 'completed' && task.dateCompleted === date
    ).length;

    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      completions,
      fullDate: date, // Keep full date for tooltip
    };
  });

  return (
    <div className="h-64 mb-8">
      <h2 className="text-lg font-semibold mb-4">Completed Tasks (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip 
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return new Date(payload[0].payload.fullDate).toLocaleDateString();
              }
              return label;
            }}
          />
          <ReferenceLine 
            y={1} 
            stroke="red" 
            strokeDasharray="3 3" 
            label={{ value: "Goal: 1/day", position: "top" }} 
          />
          <Bar dataKey="completions" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}