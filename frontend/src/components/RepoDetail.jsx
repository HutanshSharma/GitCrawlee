import { useState, useRef, useLayoutEffect } from 'react';
import { Bar, Line, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import RadialFileMap from './RepoGraph';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { ChartColumnBig, Computer, FolderOpen,SquareActivity,BadgeAlert,HeartPulse, ChartPie,Link} from "lucide-react"

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, 
  LineElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler
);

const RepoDetail = ({ repo, onBack, prevPage }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeTab];
      if (el) setIndicator({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeTab]);

  const commitCounts = Object.values(repo.commits);
  const activeDays = commitCounts.length;
  const totalCommits = commitCounts.reduce((sum, count) => sum + count, 0);
  const peakDay = activeDays ? Math.max(...commitCounts) : 0;
  const avgPerDay = activeDays ? (totalCommits / activeDays).toFixed(1) : '0.0';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartColumnBig, color:'text-emerald-500' },
    { id: 'languages', label: 'Languages', icon: Computer, color:'text-indigo-500'},
    { id: 'files', label: 'File Structure', icon: FolderOpen, color:'text-yellow-200'},
    { id: 'activity', label: 'Activity', icon: SquareActivity, color:'text-teal-300'},
    { id: 'issues', label: 'Issues & PRs', icon: BadgeAlert, color:'text-red-600'},
    { id: 'pulse', label: 'Pulse', icon: HeartPulse, color:'text-rose-300'},
    { id: 'analytics', label: 'Analytics', icon: ChartPie, color:'text-orange-400'},
  ];

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

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-morphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{repo.repoData.stars}</div>
          <div className="text-sm text-gray-400">Stars</div>
        </div>
        <div className="glass-morphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-secondary">{repo.repoData.forks}</div>
          <div className="text-sm text-gray-400">Forks</div>
        </div>
        <div className="glass-morphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent">{repo.repoData.watchers}</div>
          <div className="text-sm text-gray-400">Watchers</div>
        </div>
        <div className="glass-morphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{repo.repoData.branches}</div>
          <div className="text-sm text-gray-400">Branches</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Repository Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Link:</span>
              <a href={repo.repoData.link} target="_blank" rel="noopener noreferrer" 
                 className="text-primary hover:text-blue-300 transition-colors">
                View on GitHub
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Description:</span>
              <span className="text-white text-right max-w-xs">
                {repo.repoData.description || 'No description available'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Languages:</span>
              <span className="text-white">{repo.repoData.languages.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Topics:</span>
              <span className="text-white">{repo.repoData.topics.length}</span>
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Commits:</span>
              <span className="text-white">{totalCommits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Days:</span>
              <span className="text-white">{activeDays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Commits/Day:</span>
              <span className="text-white">{avgPerDay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Most Active Day:</span>
              <span className="text-white">
                {Object.entries(repo.commits).reduce((max, [date, count]) => 
                  count > max.count ? { date, count } : max, { date: '', count: 0 }).count} commits
              </span>
            </div>
          </div>
        </div>
      </div>

      {repo.repoData.topics.length > 0 && (
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Topics</h3>
          <div className="flex flex-wrap gap-2">
            {repo.repoData.topics.map((topic, index) => (
              <span key={index} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLanguages = () => {
    const languageData = {
      labels: repo.repoData.languages.map(lang => lang.name),
      datasets: [{
        data: repo.repoData.languages.map(lang => parseFloat(lang.percentage.replace('%', ''))),
        backgroundColor: repo.repoData.languages.map(lang => getLanguageColor(lang.name)),
        borderWidth: 2,
        borderColor: '#1F2937'
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#D1D5DB', padding: 20 }
        },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#ffffff',
          bodyColor: '#D1D5DB'
        }
      }
    };

    const polarData = {
      labels: repo.repoData.languages.map(lang => lang.name),
      datasets: [{
        data: repo.repoData.languages.map(lang => parseFloat(lang.percentage.replace('%', ''))),
        backgroundColor: repo.repoData.languages.map(lang => getLanguageColor(lang.name) + '80'),
        borderColor: repo.repoData.languages.map(lang => getLanguageColor(lang.name)),
        borderWidth: 2
      }]
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Language Distribution</h3>
            <div className="h-80">
              <Doughnut data={languageData} options={options} />
            </div>
          </div>
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Language Polar View</h3>
            <div className="h-80">
              <PolarArea data={polarData} options={options} />
            </div>
          </div>
        </div>
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Language Breakdown</h3>
          <div className="space-y-3">
            {repo.repoData.languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: getLanguageColor(lang.name) }}
                  ></div>
                  <span className="text-white">{lang.name}</span>
                </div>
                <span className="text-gray-400">{lang.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderActivity = () => {
    const commitData = Object.entries(repo.commits).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date,
      count
    })).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

    const lineData = {
      labels: commitData.map(item => item.date),
      datasets: [{
        label: 'Commits',
        data: commitData.map(item => item.count),
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    };

    const barData = {
      labels: commitData.map(item => item.date),
      datasets: [{
        label: 'Daily Commits',
        data: commitData.map(item => item.count),
        backgroundColor: '#10B981',
        borderRadius: 8,
        borderSkipped: false,
      }]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#ffffff',
          bodyColor: '#D1D5DB'
        }
      },
      scales: {
        x: { ticks: { color: '#D1D5DB' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
        y: { 
          beginAtZero: true,
          ticks: { color: '#D1D5DB', stepSize: 1 }, 
          grid: { color: 'rgba(255, 255, 255, 0.1)' } 
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Commit Trend</h3>
            <div className="h-80">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Commits</h3>
            <div className="h-80">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Activity Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">{peakDay}</div>
              <div className="text-sm text-gray-400">Peak Day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-1">{avgPerDay}</div>
              <div className="text-sm text-gray-400">Avg/Day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">{activeDays}</div>
              <div className="text-sm text-gray-400">Active Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{totalCommits}</div>
              <div className="text-sm text-gray-400">Total Commits</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIssuesAndPRs = () => {
    const comparisonData = {
      labels: ['Issues', 'Pull Requests'],
      datasets: [
        {
          label: 'Open',
          data: [repo.issues.open, repo.pulls.open],
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: '#EF4444',
          borderWidth: 2
        },
        {
          label: 'Closed',
          data: [repo.issues.closed, repo.pulls.closed],
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: '#10B981',
          borderWidth: 2
        }
      ]
    };

    const comparisonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#D1D5DB' }
        },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#ffffff',
          bodyColor: '#D1D5DB'
        }
      },
      scales: {
        x: { ticks: { color: '#D1D5DB' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
        y: { 
          beginAtZero: true,
          ticks: { color: '#D1D5DB', stepSize: 1 }, 
          grid: { color: 'rgba(255, 255, 255, 0.1)' } 
        }
      }
    };

    // Doughnut chart for issue status
    const issueStatusData = {
      labels: ['Open Issues', 'Closed Issues'],
      datasets: [{
        data: [repo.issues.open, repo.issues.closed],
        backgroundColor: ['#EF4444', '#10B981'],
        borderWidth: 2,
        borderColor: '#1F2937'
      }]
    };

    // PR metrics doughnut
    const prMetricsData = {
      labels: ['Open PRs', 'Closed PRs', 'Labels', 'Milestones'],
      datasets: [{
        data: [repo.pulls.open, repo.pulls.closed, repo.pulls.labels, repo.pulls.milestones],
        backgroundColor: ['#6366F1', '#A855F7', '#F59E0B', '#06B6D4'],
        borderWidth: 2,
        borderColor: '#1F2937'
      }]
    };

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#D1D5DB', padding: 15 }
        },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#ffffff',
          bodyColor: '#D1D5DB'
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Issues</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Open Issues</span>
                <span className="text-red-400 font-semibold">{repo.issues.open}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Closed Issues</span>
                <span className="text-green-400 font-semibold">{repo.issues.closed}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {repo.issues.open + repo.issues.closed}
                  </div>
                  <div className="text-sm text-gray-400">Total Issues</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pull Requests</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Open PRs</span>
                <span className="text-blue-400 font-semibold">{repo.pulls.open}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Closed PRs</span>
                <span className="text-purple-400 font-semibold">{repo.pulls.closed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Milestones</span>
                <span className="text-yellow-400 font-semibold">{repo.pulls.milestones}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Labels</span>
                <span className="text-gray-300 font-semibold">{repo.pulls.labels}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Issues vs PRs Comparison</h3>
            <div className="h-80">
              <Bar data={comparisonData} options={comparisonOptions} />
            </div>
          </div>

          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Issue Status Distribution</h3>
            <div className="h-80">
              <Doughnut data={issueStatusData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pull Request Metrics</h3>
          <div className="h-80">
            <Doughnut data={prMetricsData} options={doughnutOptions} />
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Issues vs PRs Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">{repo.issues.open}</div>
              <div className="text-sm text-gray-400">Open Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{repo.issues.closed}</div>
              <div className="text-sm text-gray-400">Closed Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{repo.pulls.open}</div>
              <div className="text-sm text-gray-400">Open PRs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{repo.pulls.closed}</div>
              <div className="text-sm text-gray-400">Closed PRs</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPulse = () => {
    // Pulse activity radar chart
    const pulseRadarData = {
      labels: ['Active Discussions', 'Closed Issues', 'Merged PRs', 'New Issues', 'Proposed PRs'],
      datasets: [{
        label: 'Repository Pulse',
        data: [
          repo.pulse.active_discussions,
          repo.pulse.closed_issues['issues'],
          repo.pulse.merged_pull['Pull requests'],
          repo.pulse.new_issues['issues'],
          repo.pulse.proposed_pull["Pull requests"]
        ],
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        borderColor: '#A855F7',
        borderWidth: 2,
        pointBackgroundColor: '#A855F7',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }]
    };


    const radarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#ffffff',
          bodyColor: '#D1D5DB'
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          ticks: { color: '#D1D5DB', backdropColor: 'transparent' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: { color: '#D1D5DB', font: { size: 11 } }
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Repository Pulse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-300">Activity Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Discussions</span>
                  <span className="text-primary">{repo.pulse.active_discussions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">New Issues</span>
                  <span className="text-red-400">{repo.pulse.new_issues['issues']} Opened By {repo.pulse.new_issues['opened by']}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Closed Issues</span>
                  <span className="text-green-400">{repo.pulse.closed_issues['issues']} Closed By {repo.pulse.closed_issues['closed by']}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Proposed PRs</span>
                  <span className="text-blue-400">{repo.pulse.proposed_pull['Pull requests']} Proposed By {repo.pulse.proposed_pull['opened by']}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Merged PRs</span>
                  <span className="text-purple-400">{repo.pulse.merged_pull['Pull requests']} Merged By {repo.pulse.merged_pull['merged by']}</span>
                </div>
              </div>
            </div>
            
            {repo.pulse.merges_data && (
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-300">Code Changes</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Commits (All Branches)</span>
                    <span className="text-yellow-400">{repo.pulse.merges_data.commits_pushed_to_all_branches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Commits (Main)</span>
                    <span className="text-accent">{repo.pulse.merges_data.commits_pushed_to_main}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Authors</span>
                    <span className="text-secondary">{repo.pulse.merges_data.authors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Additions</span>
                    <span className="text-green-400">{repo.pulse.merges_data.additions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deletions</span>
                    <span className="text-red-400">{repo.pulse.merges_data.deletions}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pulse Activity Radar</h3>
          <div className="h-80">
            <Radar data={pulseRadarData} options={radarOptions} />
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    const languageComplexity = repo.repoData.languages.length;
    const dominantLanguage = repo.repoData.languages[0];
    
    const healthData = {
      labels: ['Activity', 'Consistency', 'Language Diversity', 'Community', 'Maintenance', 'Documentation'],
      datasets: [{
        label: 'Repository Health',
        data: [
          Math.min(totalCommits / 10, 10),
          Math.min(activeDays / 5, 10),
          Math.min(languageComplexity * 2, 10), // Language Diversity
          Math.min((repo.repoData.stars + repo.repoData.forks + repo.repoData.watchers) / 2, 10), // Community
          repo.repoData.description ? 8 : 3, // Maintenance
          repo.repoData.topics.length > 0 ? 7 : 2 // Documentation
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366F1',
        borderWidth: 2,
        pointBackgroundColor: '#6366F1',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }]
    };

    const healthOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#ffffff',
          bodyColor: '#D1D5DB'
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          ticks: { color: '#D1D5DB', backdropColor: 'transparent' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: { color: '#D1D5DB', font: { size: 12 } }
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Repository Health Score</h3>
            <div className="h-80">
              <Radar data={healthData} options={healthOptions} />
            </div>
          </div>

          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Commit Frequency</span>
                <span className="text-primary font-semibold">{avgPerDay}/day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Language Diversity</span>
                <span className="text-secondary font-semibold">{languageComplexity} languages</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Dominant Language</span>
                <span className="text-accent font-semibold">{dominantLanguage?.name} ({dominantLanguage?.percentage})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Community Score</span>
                <span className="text-yellow-400 font-semibold">
                  {repo.repoData.stars + repo.repoData.forks + repo.repoData.watchers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Documentation</span>
                <span className={`font-semibold ${repo.repoData.description && repo.repoData.topics.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {repo.repoData.description && repo.repoData.topics.length > 0 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Development Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{activeDays}</div>
              <div className="text-gray-400 text-sm">Active Development Days</div>
              <div className="text-xs text-gray-500 mt-1">
                Shows consistency in development
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">{peakDay}</div>
              <div className="text-gray-400 text-sm">Peak Daily Commits</div>
              <div className="text-xs text-gray-500 mt-1">
                Highest productivity day
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {parseFloat(dominantLanguage?.percentage || '0').toFixed(0)}%
              </div>
              <div className="text-gray-400 text-sm">Primary Language</div>
              <div className="text-xs text-gray-500 mt-1">
                {dominantLanguage?.name || 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'languages': return renderLanguages();
      case 'activity': return renderActivity();
      case 'issues': return renderIssuesAndPRs();
      case 'pulse': return renderPulse();
      case 'analytics': return renderAnalytics();
      case 'files': return <RadialFileMap data={repo.filesData} />;
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {repo.repoData.link.split('/').pop()}
            </h1>
            <p className="text-gray-400">
              {repo.repoData.description || 'No description available'}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href={repo.repoData.link} target="_blank" rel="noopener noreferrer" 
                 className="text-primary hover:text-blue-300 transition-colors text-sm flex gap-2">
                <Link size={'20px'}/> <div>View on GitHub</div>
              </a>
              <span className="text-gray-500 text-sm">
                {repo.repoData.languages.length} languages • {Object.keys(repo.commits).length} active days
              </span>
            </div>
          </div>
          <button
            onClick={onBack}
            className="shrink-0 px-5 py-2.5 glass-morphism hover:border-white/15 text-gray-300 hover:text-white rounded-xl transition-all duration-200"
          >
            ← Back to {prevPage==='dashboard' ? 'Dashboard':'Search'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-4 z-20 flex flex-wrap gap-1.5 mb-8 p-1.5 rounded-lg tabbar">
          <div
            className="absolute rounded-md bg-white/[0.08] border border-white/[0.06] pointer-events-none"
            style={{
              left: indicator.left, top: indicator.top, width: indicator.width, height: indicator.height,
              transition: 'left 0.35s var(--spring), top 0.35s var(--spring), width 0.35s var(--spring), height 0.35s var(--spring)',
            }}
          />
          {tabs.map(tab => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              onClick={() => setActiveTab(tab.id)}
              className={`relative z-10 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={16} className={tab.color}/>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div key={activeTab} className="reveal">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default RepoDetail;