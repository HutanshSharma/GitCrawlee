import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const LanguageChart = ({ repos }) => {
  const languageStats = repos.reduce((acc, repo) => {
    if (repo.most_used_language && repo.most_used_language !== 'N/A') {
      acc[repo.most_used_language] = (acc[repo.most_used_language] || 0) + 1;
    }
    return acc;
  }, {});

  const getLanguageColors = () => {
    const colors = [
      '#6366F1', '#A855F7', '#2DD4BF', '#F59E0B',
      '#EF4444', '#06B6D4', '#84CC16', '#F97316',
      '#EC4899', '#818CF8', '#14B8A6', '#FACC15'
    ];
    return colors;
  };

  const data = {
    labels: Object.keys(languageStats),
    datasets: [
      {
        data: Object.values(languageStats),
        backgroundColor: getLanguageColors(),
        borderWidth: 2,
        borderColor: '#1F2937',
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#D1D5DB',
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#ffffff',
        bodyColor: '#D1D5DB',
        borderColor: '#6366F1',
        borderWidth: 1
      }
    }
  };

  return (
    <div className="glass-morphism rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Language Distribution</h3>
      <div className="h-80">
        {Object.keys(languageStats).length > 0 ? (
          <Doughnut data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>No language data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageChart;