import {Star , Computer, Flame,UserRoundCheck,UsersRound,} from "lucide-react"

const ProfileStats = ({ profile }) => {
  const stats = [
    {
      label: 'Followers',
      value: profile.followers,
      icon: UsersRound,
      color: 'text-primary',
      description: 'GitHub followers'
    },
    {
      label: 'Following',
      value: profile.following,
      icon: UserRoundCheck,
      color: 'text-secondary',
      description: 'Following users'
    },
    {
      label: 'Latest Stars',
      value: profile.repos_list.reduce((acc, repo) => {
        const stars = typeof repo.stars === 'number' ? repo.stars : 0;
        return acc + stars;
      }, 0),
      icon: Star,
      color: 'text-yellow-400',
      description: 'Stars received'
    },
    {
      label: 'Languages',
      value: new Set(profile.repos_list.map(repo => repo.most_used_language).filter(lang => lang && lang !== 'N/A')).size,
      icon: Computer,
      color: 'text-purple-400',
      description: 'Programming languages'
    },
    {
      label: 'Recent Activity',
      value: profile.repos_list.filter(repo => {
        const updatedDate = new Date(repo.updated_at);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return updatedDate > thirtyDaysAgo;
      }).length,
      icon: Flame,
      color: 'text-orange-400',
      description: 'Updated in 30 days'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="glass-morphism card-hover p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/[0.04] border border-white/[0.06]">
              <stat.icon size={16} className={stat.color}/>
            </span>
          </div>
          <div className={`text-2xl font-bold tabular-nums ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-200 font-medium mt-1">{stat.label}</div>
          <div className="text-xs text-gray-500">{stat.description}</div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;