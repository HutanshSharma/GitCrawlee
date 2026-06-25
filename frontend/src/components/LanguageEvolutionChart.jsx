import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const LanguageEvolutionChart = ({ repos }) => {
  // Count language usage
  const languageStats = repos.reduce((acc, repo) => {
    if (repo.most_used_language && repo.most_used_language !== 'N/A') {
      acc[repo.most_used_language] = (acc[repo.most_used_language] || 0) + 1;
    }
    return acc;
  }, {});

  // Get top 8 languages for radar chart
  const topLanguages = Object.entries(languageStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const data = {
    labels: topLanguages.map(([lang]) => lang),
    datasets: [
      {
        label: 'Repository Count',
        data: topLanguages.map(([, count]) => count),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366F1',
        borderWidth: 2,
        pointBackgroundColor: '#6366F1',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
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
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `💻 ${context.parsed.r} repositories`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          color: '#D1D5DB',
          stepSize: 1,
          backdropColor: 'transparent'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: '#D1D5DB',
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="glass-morphism rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Language Proficiency Radar</h3>
      <div className="h-80">
        {topLanguages.length > 0 ? (
          <Radar data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <p>No language data available</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <p>Radar chart showing expertise across different programming languages</p>
      </div>
    </div>
  );
};

export default LanguageEvolutionChart;