import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const RepoSizeChart = ({ repos }) => {
  // Create scatter plot data based on repo age vs stars
  const scatterData = repos.map(repo => {
    const updatedDate = new Date(repo.updated_at);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now - updatedDate) / (1000 * 60 * 60 * 24));
    
    return {
      x: daysSinceUpdate,
      y: repo.stars || 0,
      label: repo.name,
      language: repo.most_used_language
    };
  });

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': '#f1e05a',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C': '#555555',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'TypeScript': '#2b7489',
      'Jupyter Notebook': '#DA5B0B',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'PHP': '#4F5D95'
    };
    return colors[language] || '#858585';
  };

  const data = {
    datasets: [{
      label: 'Repositories',
      data: scatterData,
      backgroundColor: scatterData.map(point => getLanguageColor(point.language)),
      borderColor: scatterData.map(point => getLanguageColor(point.language)),
      borderWidth: 2,
      pointRadius: 8,
      pointHoverRadius: 10
    }]
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
          title: function(context) {
            return scatterData[context[0].dataIndex].label;
          },
          label: function(context) {
            const point = scatterData[context.dataIndex];
            return [
              `⭐ ${point.y} stars`,
              `📅 ${point.x} days since update`,
              `💻 ${point.language || 'Unknown'}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Days Since Last Update',
          color: '#D1D5DB'
        },
        ticks: {
          color: '#D1D5DB'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Stars',
          color: '#D1D5DB'
        },
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
      <h3 className="text-xl font-semibold text-white mb-6">Repository Activity vs Stars</h3>
      <div className="h-80">
        <Scatter data={data} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <p>Each dot represents a repository. Position shows recency vs popularity.</p>
      </div>
    </div>
  );
};

export default RepoSizeChart;