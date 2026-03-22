import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';
import './styles/GroupDiscoveryPage.css';

export default function GroupDiscoveryPage() {
  const { fetchGroups, groups, loading, error } = useGroupContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    let filtered = groups;
    if (searchTerm) {
      filtered = filtered.filter((group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((group) => group.category === selectedCategory);
    }
    setFilteredGroups(filtered);
  }, [groups, searchTerm, selectedCategory]);

  const categories = [...new Set(groups.map((g) => g.category).filter(Boolean))];

  return (
    <div className="bg-surface text-on-surface">
      {/* Brand & Header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-primary mb-6 tracking-tight leading-[1.1]">
              Discover Your <br/><span className="text-tertiary-container">Knowledge Circle</span>
            </h1>
            <p className="text-secondary font-body text-lg leading-relaxed max-w-xl">
              Join specialized communities of professionals navigating the same career waters as you. Exchange insights, mentorship, and opportunities.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input 
            className="w-full h-20 pl-20 pr-8 bg-surface-container-highest border-none rounded-2xl text-on-surface placeholder:text-outline focus:ring-4 focus:ring-primary/5 focus:bg-surface-container-lowest transition-all duration-300 font-body text-xl shadow-sm" 
            placeholder="Search for groups, skills, or topics..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Category Filters */}
      <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar mb-12">
        <button 
          onClick={() => setSelectedCategory('')}
          className={`px-8 py-3 font-label text-xs font-bold uppercase tracking-widest rounded-full shadow-lg transition-all whitespace-nowrap ${!selectedCategory ? 'bg-primary text-white' : 'bg-surface-container-highest text-secondary hover:bg-surface-container-high'}`}
        >
          All Groups
        </button>
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-3 font-label text-xs font-bold uppercase tracking-widest rounded-full transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-surface-container-highest text-secondary hover:bg-surface-container-high'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && <div className="p-4 mb-4 text-error bg-error-container rounded-xl">{error}</div>}

      {loading ? (
        <div className="text-center p-12">Loading groups...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, index) => {
              const isFeatured = index % 3 === 2; // alternates featured design style
              
              if (isFeatured) {
                return (
                  <Link key={group._id} to={`/groups/${group._id}`} className="group relative overflow-hidden bg-primary p-10 rounded-2xl flex flex-col h-full transition-all duration-300 hover:shadow-[0px_24px_48px_rgba(31,27,24,0.12)] hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-tertiary-container/30 rounded-bl-[100%] blur-3xl -mr-16 -mt-16"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
                      </div>
                      <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-label font-bold uppercase tracking-widest text-white border border-white/10">Featured</span>
                    </div>
                    <h3 className="font-headline text-2xl font-bold text-white mb-4 leading-tight relative z-10">{group.name}</h3>
                    <p className="text-base font-body text-on-primary-container leading-relaxed mb-10 flex-grow relative z-10">{group.description}</p>
                    <div className="flex items-center justify-between mt-auto relative z-10">
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="material-symbols-outlined text-xl">group</span>
                        <span className="text-sm font-bold">{group.memberCount || 0} members</span>
                      </div>
                      <button className="bg-white text-primary px-8 py-3.5 rounded-full font-headline text-sm font-bold hover:bg-surface-bright transition-all active:scale-95 shadow-lg">View</button>
                    </div>
                  </Link>
                );
              }

              return (
                <Link key={group._id} to={`/groups/${group._id}`} className="group bg-surface-container-lowest p-10 rounded-2xl flex flex-col h-full transition-all duration-300 hover:shadow-[0px_24px_48px_rgba(31,27,24,0.06)] hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-tertiary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-tertiary-fixed text-3xl">code</span>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-surface-container-low text-[10px] font-label font-bold uppercase tracking-widest text-secondary border border-outline-variant/10">{group.category || 'General'}</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-primary mb-4 leading-tight">{group.name}</h3>
                  <p className="text-base font-body text-on-surface-variant leading-relaxed mb-10 flex-grow">{group.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-xl">group</span>
                      <span className="text-sm font-bold">{group.memberCount || 0} members</span>
                    </div>
                    <button className="bg-primary text-white px-8 py-3.5 rounded-full font-headline text-sm font-bold hover:bg-primary-container transition-all active:scale-95 shadow-md">View</button>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full p-12 text-center text-outline bg-surface-container-lowest rounded-2xl">No groups matched your search bounds.</div>
          )}
        </div>
      )}
    </div>
  );
}
