import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ActivityChart = ({ repos }) => {
  // Generate activity data based on update dates
  const activityData = repos.reduce((acc, repo) => {
    const date = new Date(repo.updated_at);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {});

  // Sort by date and take last 12 months
  const sortedData = Object.entries(activityData)
    .sort(([a], [b]) => new Date(a + " 1") - new Date(b + " 1"))
    .slice(-12);

  const data = {
    labels: sortedData.map(([month]) => month),
    datasets: [
      {
        label: 'Repository Updates',
        data: sortedData.map(([, count]) => count),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: '#6366F1',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#ffffff',
        bodyColor: '#D1D5DB',
        borderColor: '#6366F1',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#D1D5DB'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#D1D5DB',
          stepSize: 1
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div className="glass-morphism rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Repository Activity</h3>
      <div className="h-80">
        {sortedData.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p>No activity data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityChart;