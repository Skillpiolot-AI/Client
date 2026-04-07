import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';

function timeSince(date) {
  const sec = Math.floor((Date.now() - new Date(date)) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

export default function GroupDiscoveryPage() {
  const { fetchGroups, groups, loading, error, getLatestPosts } = useGroupContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
    // Fetch latest posts across all public groups
    setPostsLoading(true);
    getLatestPosts(10).then(data => {
      setLatestPosts(data.posts || []);
      setPostsLoading(false);
    }).catch(() => setPostsLoading(false));
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
    <main className="min-h-screen flex flex-col bg-surface font-body text-on-surface antialiased selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      {/* Featured Hero Section */}
      <section className="relative w-full h-[614px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Collaborative workspace" className="w-full h-full object-cover" data-alt="Modern high-end shared workspace with professionals collaborating around a large table, soft morning light hitting architectural details, professional atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBoUfAkvr5xOt2K7w5MsvKtk3cMC01rnAZNZHI56piDXut1Guuj6IDeejxp_vJlBZgwUJg9O-peffg_1hd_bcL5zEn-6W5UjdW-jLciuL3jo6AqPT8Udc5JgEB6dkT_I0O4TdFQxkKxYDJBF4zpsFFLwdEi60gvLV17y7hGQIEKDWZxv3HRuahvKTCZIgFawv1KCLAAdob2k1JHjUxuc-zBqJnSYS4CxEyDvMb3B0cOz1vHn4WG4YZ-8MlC35LlRsghVq6RbAC0YU"/>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-[1920px] w-full px-12 md:px-24">
          <div className="max-w-3xl">
            <nav className="flex items-center space-x-2 text-white/70 mb-8">
              <Link to="/groups" className="text-xs font-label uppercase tracking-widest hover:text-white transition-colors">Groups</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-xs font-label uppercase tracking-widest font-bold text-white">Discovery</span>
            </nav>
            <span className="font-label text-tertiary-fixed tracking-[0.2em] uppercase text-xs mb-6 block font-bold">Featured Communities</span>
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tighter">
              Find your next <br/><span className="text-on-tertiary-container">Strategic Alliance.</span>
            </h1>
            <p className="text-surface-container-highest text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Connect with industry-leading mentors and peers in curated environments designed for professional acceleration.
            </p>
            <div className="flex gap-4">
              <Link to="/groups/create" className="premium-gradient !text-black px-8 py-4 rounded-xl font-bold hover:shadow-[0px_20px_40px_rgba(31,27,24,0.15)] transition-all duration-300 active:scale-95 flex items-center gap-2">
                <span>Start a Community</span>
                <span className="material-symbols-outlined text-sm">north_east</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-0 z-40 px-12 py-8 bg-surface/90 backdrop-blur-xl">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative w-full md:w-[400px]">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline">search</span>
            </div>
            <input 
              className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface" 
              placeholder="Search skills, industries, or keywords..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <button 
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-primary !text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest'}`}
            >
              All Groups
            </button>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-primary !text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest'}`}
              >
                {cat}
              </button>
            ))}
            <div className="w-px h-6 bg-outline-variant/30 mx-2"></div>
            <button className="flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-lg">tune</span>
              <span>Filters</span>
            </button>
          </div>
        </div>
      </section>

      {/* Discovery Grid */}
      <section className="px-12 pb-24 flex-grow bg-surface">
        <div className="max-w-[1920px] mx-auto">
          {error && <div className="p-4 mb-8 text-error bg-error-container rounded-xl">{error}</div>}
          
          {loading ? (
            <div className="text-center p-12 text-outline font-medium">Loading communities...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, index) => {
                  const images = [
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuD5KC0dUs5i3tJk2shLxcZs5tPXAcKMUcgy4GiPVYjhCxcgfnnblKbGZvn274Qq9qJKuKCvWiP18tGb0L4JmtP3orPbSBSFrzQhRbtm5liuWmS_mnK7tR-4QSR_yNtLAnvEUnq7PsEHsyAbA5XP5hyPmjbxG7JRjSiNNmMkHrFEBTWdU6XntSHaCP4l7GQyCVWaZYEEVz8n2o2D4XdC9fuuc6D88pB72Ab1lhCTKZHUpApcATKjh-svwzNgFjmxSHCO8f4PrGQ_3bU",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDhliaPq87ZyhwVBHJ4sl1da_P8MG37TTQYw2vIcZF9ptd0RemzokCAEjWszdyw051t65IICNcyYz9eVJkk1UtZwf0km-_OoXu4ynYDtuI7xFMOML1TKeFH6fMtx23BylovA_31g5h8V70u0ZTOt85lPyKl316d9xiL5hIqxDtq0nF1JG48WCK6D944ToZASd3kp9Vm1taGgdC-SxeVkXSnZH-P9JV8zqRYy2WsojWfImHXrdTN_54JoC1MJ32dfHJ-__ALwY6RFdY",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAjSgAkA8dKDDbP2JJXumd5IF_CKAmkNywZaaqAnIvPwq_pmL6TF4H2t-Ckl3tJz-G6fxQJ_7yna2CmpNkSkSKTp6hEeD1wxXVwojOWjdbNcdi2wCUs_kUERO3gFzJOgmvlpwp6PN_7wKaRh47bySvIDI0CRNJNKi80KHI5I0cUxTQCAkyZM3hiZuhpSiwA_PNseZHSk7rgAE5mJKLjvix-Q6T_HkbpGEcM2TdvdIpEiIPpTukYziJMxQjY0bkk9A2_CzY8rsBjcQs",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDuHonVp-CfEVuopgZ-JUCIR0ixvyRJTMflZ5GiR9xjz3o5X0HpiPr5fY_h_w3U5zJp90dnYzJCshKQNby9raD8G0AHqlgrd1lgxwH3Z6oVBDKh9UH2aXIf4yk__okslhz50EIAAvEZkBAs9pei-nA99iejSWBXY7wSXy4_PCyzhIWr3mq41nKr7lBritBEXXJwnDQOqgtkRURLPyoOulEIuGPbHFtEycLi2NZO7XYv7mzT32GC33xAwACv26csrhKJ2oK6tkAYI5Q"
                  ];
                  const imgSrc = images[index % images.length];

                  return (
                    <Link key={group._id} to={`/groups/${group._id}`} className="group relative flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden hover:shadow-[0px_20px_40px_rgba(31,27,24,0.06)] transition-all duration-500 transform hover:-translate-y-1">
                      <div className="h-48 overflow-hidden relative">
                        <img alt={group.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={imgSrc}/>
                        <div className="absolute top-4 left-4">
                          <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{group.category || 'General'}</span>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-headline text-xl font-bold text-primary group-hover:text-tertiary-container transition-colors truncate pr-2">{group.name}</h3>
                          <div className="flex items-center gap-1 text-on-surface-variant flex-shrink-0">
                            <span className="material-symbols-outlined text-sm">groups</span>
                            <span className="text-xs font-semibold">{group.memberCount || 0}</span>
                          </div>
                        </div>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                            {group.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container flex items-center justify-center font-bold text-[10px] text-primary">{(group.memberCount || 0) > 0 ? `+${group.memberCount}` : '0'}</div>
                          </div>
                          <button className="text-primary font-bold text-sm flex items-center gap-1 group/btn">
                              View <span className="material-symbols-outlined text-lg transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full p-12 text-center text-outline bg-surface-container-lowest rounded-2xl">No groups matched your search bounds.</div>
              )}
            </div>
          )}

          {filteredGroups.length > 0 && (
            <div className="mt-20 flex flex-col items-center">
              <div className="w-full h-px bg-outline-variant/20 mb-12"></div>
              <button className="px-12 py-5 rounded-xl font-bold border-2 border-primary text-primary hover:bg-primary hover:!text-white transition-all duration-300">
                  Explore More Communities
              </button>
              <p className="mt-6 text-on-surface-variant text-xs font-medium uppercase tracking-widest">Showing {filteredGroups.length} verified groups</p>
            </div>
          )}

          {/* ── Latest Posts Section ── */}
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
              <h2 className="font-headline text-2xl font-extrabold tracking-tight">Latest Posts</h2>
              <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold ml-2">Across all communities</span>
            </div>
            {postsLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : latestPosts.length === 0 ? (
              <div className="p-10 text-center text-outline bg-surface-container-lowest rounded-2xl">No posts yet. Be the first to post!</div>
            ) : (
              <div className="space-y-3">
                {latestPosts.map(post => (
                  <Link
                    key={post._id}
                    to={`/groups/${post.group?._id}/post/${post._id}`}
                    className="flex gap-4 bg-surface-container-lowest rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    {/* Group avatar */}
                    <div className="w-10 h-10 rounded-xl bg-primary flex-shrink-0 flex items-center justify-center font-headline font-black text-white text-lg">
                      {post.group?.name?.charAt(0)?.toUpperCase() || 'G'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1 flex-wrap">
                        <span className="font-bold text-primary group-hover:underline">{post.group?.name}</span>
                        <span>·</span>
                        <span>{post.author?.name || 'Anonymous'}</span>
                        <span>·</span>
                        <span>{timeSince(post.createdAt)}</span>
                        {post.subGroup && (
                          <><span>·</span><span className="font-semibold text-primary">/{post.subGroup.slug}</span></>
                        )}
                      </div>
                      <p className="text-sm text-on-surface leading-relaxed line-clamp-2">{post.body}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">arrow_upward</span>
                          {post.score || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">chat_bubble</span>
                          {post.commentsCount || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Accent */}
      <footer className="bg-surface-container-low py-12 px-12 mt-auto">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-headline font-black text-2xl tracking-tighter text-primary">SkillPilot.</span>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest bg-white px-2 py-0.5 rounded">Navigator</span>
          </div>
          <div className="flex gap-8">
            <Link to="#" className="text-xs font-bold text-on-surface-variant uppercase hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="text-xs font-bold text-on-surface-variant uppercase hover:text-primary transition-colors">Guidelines</Link>
            <Link to="#" className="text-xs font-bold text-on-surface-variant uppercase hover:text-primary transition-colors">Support</Link>
          </div>
          <p className="text-xs text-on-surface-variant/60 font-medium">© 2024 Strategic Career Ecosystems Inc.</p>
        </div>
      </footer>
    </main>
  );
}
