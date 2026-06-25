import { useMemo } from 'react';
import { useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import RepoCard from './RepoCard';
import ProfileStats from './ProfileStats';
import LanguageChart from './LanguageChart';
import ActivityChart from './ActivityChart';
import StarsChart from './StarsChart';
import RepoSizeChart from './RepoSizeChart';
import CommitFrequencyChart from './CommitFrequencyChart';
import LanguageEvolutionChart from './LanguageEvolutionChart';

const Dashboard = ({ userData, onRepoSelect, onBackToHome, loadall, isloaded, setPrevPage}) => {
  const navigate = useNavigate()

  const filteredRepos = userData.profile.repos_list

  const allLanguages = useMemo(() => {
    const languages = new Set();
    userData.profile.repos_list.forEach(repo => {
      if (repo.most_used_language && repo.most_used_language !== 'N/A') {
        languages.add(repo.most_used_language);
      }
    });
    return Array.from(languages).sort();
  }, [userData.profile.repos_list]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="reveal flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-2xl font-semibold shrink-0">
              {(userData.profile.username || userData.profile.nickname || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold gradient-text mb-1 truncate">
                {userData.profile.username}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">@{userData.profile.nickname}</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/15 text-primary rounded-md text-xs font-medium">
                  <User size={13}/> Personal
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onBackToHome}
            className="btn shrink-0 px-5 py-2.5 glass-morphism hover:border-white/15 text-gray-300 hover:text-white rounded-lg flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </div>

        <div className="reveal" style={{ animationDelay: '0.05s' }}>
          <ProfileStats profile={userData.profile} />
        </div>

        <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" style={{ animationDelay: '0.1s' }}>
          <LanguageChart repos={userData.profile.repos_list} />
          <ActivityChart repos={userData.profile.repos_list} />
        </div>

        <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" style={{ animationDelay: '0.16s' }}>
          <StarsChart repos={userData.profile.repos_list} />
          <RepoSizeChart repos={userData.profile.repos_list} />
        </div>

        <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" style={{ animationDelay: '0.22s' }}>
          <CommitFrequencyChart repos={userData.profile.repos_list} />
          <LanguageEvolutionChart repos={userData.profile.repos_list} />
        </div>

        <div className="reveal glass-morphism mb-6 overflow-hidden" style={{ animationDelay: '0.28s' }}>
          <div className="px-6 pt-6 pb-5">
            <h3 className="text-lg font-semibold text-white">Repository Insights</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
            {[
              { value: userData.profile.repos_list.reduce((acc, repo) => acc + (repo.stars || 0), 0), label: 'Total Stars', color: 'text-primary' },
              { value: allLanguages.length, label: 'Languages Used', color: 'text-secondary' },
              { value: userData.profile.repos_list.filter(repo => repo.description && repo.description.trim()).length, label: 'Documented Repos', color: 'text-accent' },
              { value: userData.profile.repos_list.filter(repo => new Date(repo.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, label: 'Recent Updates', color: 'text-yellow-400' },
            ].map((s) => (
              <div key={s.label} className="bg-[#0b0c10] px-6 py-7 text-center">
                <div className={`text-3xl font-bold mb-1 tabular-nums ${s.color}`}>{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className='reveal flex flex-col gap-4 glass-morphism p-8' style={{ animationDelay: '0.34s' }}>
          <h2 className="text-xl font-semibold text-white">Search Through Repositories</h2>
          <p className="text-sm text-gray-400 max-w-2xl">
            {!isloaded
              ? 'Scanning may take a moment depending on how many repositories need to be processed — larger profiles take a little longer.'
              : 'Repository data is ready. Search and filter through them below.'}
          </p>
          <button onClick={()=>{
                              if(!isloaded){
                                loadall()
                                navigate('/loading')
                              }
                              else{
                                navigate('/repos')
                              }
                            }}
            className='btn self-start bg-primary hover:bg-primary/90 py-3 px-6 rounded-lg text-white font-semibold hover:shadow-[0_8px_28px_-8px_rgba(99,102,241,0.7)]'>
            {!isloaded ? 'Start Searching':'Search'}
          </button>
        </div>
        
        <div className="reveal mt-8" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              Latest Repositories
              <span className="text-sm text-gray-500 font-normal tabular-nums">{filteredRepos.length}</span>
            </h2>
            <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                Recently Updated
              </span>
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></span>
                Has Stars
              </span>
            </div>
          </div>

          {filteredRepos.length === 0 ? (
            <div className="glass-morphism p-16 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500">
                <User size={20} />
              </div>
              <h3 className="text-base font-semibold text-gray-300 mb-1">No repositories found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo, index) => (
                <RepoCard
                  key={index}
                  index={index}
                  repo={repo}
                  onClick={() =>{
                    onRepoSelect(repo.name)
                    navigate('/loading')
                    setPrevPage('dashboard')
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;