import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom'
import { GitGraphIcon, Computer, Search, Star,Rocket, EyeClosedIcon, User} from "lucide-react"

const LightRays = lazy(() => import('./LightRays'));
const reduceMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const HomePage = ({ onSubmit }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nickname: '',
    accountType: 'personal'
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nickname.trim()) return;
    navigate('loading')

    if(formData.accountType === 'personal'){
      (async function handler(){
        const response = await fetch(`http://localhost:5000/profile/${formData.nickname}`)
        const resData = await response.json()
        const data = {...resData,'accountType':formData.accountType}
        onSubmit(data)
      })()
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    {
      icon: Computer,
      title: 'Repository Analytics',
      description: 'Comprehensive analysis of all repositories with detailed statistics and trends'
    },
    {
      icon: EyeClosedIcon,
      title: 'Language Insights',
      description: 'Visual breakdown of programming languages used across all projects'
    },
    {
      icon: GitGraphIcon,
      title: 'Activity Tracking',
      description: 'Monitor commit patterns, contribution frequency, and development activity'
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Filter repositories by language, keywords, and various criteria'
    },
    {
      icon: Star,
      title: 'Performance Metrics',
      description: 'Track stars, forks, watchers, and repository engagement metrics'
    },
    {
      icon: Rocket,
      title: 'Project Insights',
      description: 'Deep dive into individual repositories with detailed analytics tabs'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        {!reduceMotion && (
          <div className="rays-layer" aria-hidden="true">
            <Suspense fallback={null}>
              <LightRays
                raysOrigin="top-center"
                raysColor="#ffffff"
                raysSpeed={0.9}
                lightSpread={0.8}
                rayLength={1.4}
                fadeDistance={1.1}
                followMouse
                mouseInfluence={0.12}
                noiseAmount={0.06}
                distortion={0.02}
              />
            </Suspense>
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <div className="reveal inline-flex items-center gap-2 px-3 py-1 mb-7 rounded-full border border-white/10 bg-white/[0.03] text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> GitHub profile intelligence
            </div>
            <h1 className="reveal text-6xl md:text-8xl font-bold gradient-text mb-6 tracking-tight" style={{ animationDelay: '0.05s' }}>
              GitCrawlee
            </h1>
            <p className="reveal text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '0.12s' }}>
              Unlock powerful insights from any GitHub profile with beautiful visualizations,
              comprehensive analytics, and detailed repository breakdowns.
            </p>
            <div className="reveal flex flex-wrap justify-center gap-4 text-sm text-gray-400" style={{ animationDelay: '0.18s' }}>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Real-time Analysis
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                Interactive Charts
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                Detailed Metrics
              </span>
            </div>
          </div>

          <div className="max-w-md mx-auto mb-20">
            <div className="glass-morphism p-8 reveal" style={{ animationDelay: '0.24s' }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="e.g. HutanshSharma"
                    className="input-glow w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-gray-500"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <User size={18} className="text-gray-400 shrink-0"/>
                  <span className="text-sm text-gray-400">
                    Only personal accounts are supported.
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn w-full bg-primary hover:bg-primary/90 py-3.5 px-6 rounded-lg text-white font-semibold hover:shadow-[0_8px_28px_-8px_rgba(99,102,241,0.7)]"
                >
                  Start Analysis
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Powerful Analytics Features</h2>
          <p className="text-base text-gray-400 max-w-2xl mx-auto">
            Discover comprehensive insights about GitHub profiles with our advanced analysis tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden border border-white/[0.06]">
          {features.map((feature, index) => (
            <div
              key={index}
              className="reveal group bg-[#0b0c10] hover:bg-white/[0.02] p-7 transition-colors duration-300"
              style={{ animationDelay: `${0.05 + index * 0.06}s` }}
            >
              <div className="w-11 h-11 mb-5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
                <feature.icon className="w-5 h-5 text-gray-300"/>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold accent-text mb-3 tracking-tight">What You'll Discover</h2>
          <p className="text-base text-gray-400">
            Detailed insights across multiple dimensions of GitHub activity
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-xl overflow-hidden border border-white/[0.06]">
          {[
            { Icon: GitGraphIcon, color: 'text-primary', title: 'Repository', sub: 'Statistics' },
            { Icon: Computer, color: 'text-secondary', title: 'Language', sub: 'Distribution' },
            { Icon: Rocket, color: 'text-accent', title: 'Activity', sub: 'Patterns' },
            { Icon: Star, color: 'text-yellow-400', title: 'Engagement', sub: 'Metrics' },
          ].map(({ Icon, color, title, sub }, i) => (
            <div
              key={title}
              className="reveal group bg-[#0b0c10] hover:bg-white/[0.02] p-8 flex flex-col items-center text-center transition-colors duration-300"
              style={{ animationDelay: `${0.05 + i * 0.06}s` }}
            >
              <Icon size={32} className={`${color} mb-3 transition-transform duration-300 group-hover:-translate-y-0.5`}/>
              <div className="text-lg font-semibold text-white">{title}</div>
              <div className="text-sm text-gray-500">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pb-16 text-sm text-gray-600">
        <p>Enter a GitHub username above to start exploring comprehensive profile analytics</p>
      </div>
    </div>
  );
};

export default HomePage;