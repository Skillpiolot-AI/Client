import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';

export default function GroupChatPage() {
  const { id } = useParams(); // Using 'id' from the URL, like Detail page does if routed as /groups/:id/chat. But in current GroupChatPage it was 'groupId'. I will use id or groupId depending on what's available, let's stick to groupId based on original code. Wait, the route in the Detail Page links to `/groups/${id}/chat`, so the param is likely `id`. Wait, original code used `groupId`. Let's use `groupId = useParams().id || useParams().groupId` to be safe.
  const params = useParams();
  const groupId = params.groupId || params.id;
  
  const { fetchGroupById, currentGroup, getGroupMembers, groupMembers, loading } = useGroupContext();
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to the group chat!", sender: 'other', senderName: 'Admin', timestamp: new Date() }
  ]);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (groupId) {
      fetchGroupById(groupId);
      getGroupMembers(groupId);
    }
  }, [groupId, fetchGroupById, getGroupMembers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text: messageText,
        sender: 'self',
        senderName: 'You',
        timestamp: new Date(),
      }
    ]);
    setMessageText('');
  };

  if (loading) return <div className="p-12 text-center text-secondary font-medium">Loading workspace...</div>;

  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-hidden h-screen flex flex-col">
      {/* Immersive Header */}
      <header className="h-20 flex items-center justify-between px-8 bg-surface/80 backdrop-blur-xl z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-6">
          <Link to={`/groups/${groupId}`} className="p-2 -ml-2 hover:bg-surface-container rounded-xl text-outline transition-colors flex items-center">
             <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center space-x-2 text-on-surface-variant mr-4">
              <Link to="/groups" className="text-xs font-label uppercase tracking-widest hover:text-primary transition-colors">Groups</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <Link to={`/groups/${groupId}`} className="text-xs font-label uppercase tracking-widest hover:text-primary transition-colors">{currentGroup?.name || 'Group'}</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-xs font-label uppercase tracking-widest font-bold text-primary">Chat</span>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary font-bold text-lg">
              {currentGroup?.name?.charAt(0) || 'G'}
            </div>
            <div>
              <h1 className="font-headline font-extrabold text-xl tracking-tighter text-primary">{currentGroup?.name || 'Group Chat'}</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
                <span className="text-[10px] font-label font-bold uppercase tracking-widest text-outline">{groupMembers?.length || 0} Navigators</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 ml-4 px-4 py-2 bg-surface-container-low rounded-full">
            <span className="material-symbols-outlined text-outline text-sm">push_pin</span>
            <span className="text-xs font-semibold text-primary/80">{currentGroup?.category || 'General Workspace'}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2 mr-4">
            {groupMembers?.slice(0, 3).map((member, i) => (
              <div key={member._id || i} className="w-8 h-8 rounded-full ring-2 ring-surface bg-surface-container-highest flex items-center justify-center text-primary font-bold text-xs uppercase">
                {member.name?.charAt(0) || 'M'}
              </div>
            ))}
            {groupMembers?.length > 3 && (
              <div className="w-8 h-8 rounded-full ring-2 ring-surface bg-primary-container text-white flex items-center justify-center text-[10px] font-bold">
                +{groupMembers.length - 3}
              </div>
            )}
          </div>
          <button className="p-2 hover:bg-surface-container transition-colors rounded-xl text-outline">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="p-2 hover:bg-surface-container transition-colors rounded-xl text-outline">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Message Wall */}
        <section className="flex-1 flex flex-col relative bg-surface-container-low">
          <div className="flex-1 overflow-y-auto px-8 py-12 space-y-12">
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
              <span className="text-[10px] font-label font-bold uppercase tracking-widest text-outline">Chat Started</span>
              <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
            </div>

            {messages.map((msg) => {
              const isSelf = msg.sender === 'self';
              return (
                <div key={msg.id} className={`flex gap-6 items-start ${isSelf ? 'justify-end' : ''}`}>
                  {!isSelf && (
                    <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  <div className={`flex-1 space-y-1 ${isSelf ? 'flex flex-col items-end max-w-2xl' : 'max-w-2xl'}`}>
                    <div className={`flex items-baseline gap-3 ${isSelf ? 'flex-row-reverse' : ''}`}>
                      <span className="font-headline font-bold text-primary">{msg.senderName}</span>
                      <span className="text-[10px] font-label text-outline uppercase font-semibold">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`p-6 rounded-2xl shadow-[0px_10px_30px_rgba(31,27,24,0.03)] ${
                      isSelf 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-surface-container-lowest text-on-surface border-l-4 border-tertiary-fixed-variant rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                  {isSelf && (
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest text-primary flex items-center justify-center font-bold shadow-sm">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer Area */}
          <div className="p-8 bg-surface/40 backdrop-blur-md border-t border-outline-variant/10">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSendMessage} className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0px_20px_40px_rgba(31,27,24,0.08)]">
                <div className="flex items-end gap-4">
                  <button type="button" className="p-2 text-outline hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">add_circle</span>
                  </button>
                  
                  <textarea
                    className="flex-1 min-h-[44px] max-h-48 py-2 overflow-y-auto bg-transparent border-none outline-none text-primary placeholder:text-outline/50 resize-none font-body text-sm"
                    placeholder="Message Knowledge Circle..."
                    rows="1"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                  />

                  <div className="flex items-center gap-2">
                    <button type="button" className="p-2 text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">mood</span>
                    </button>
                    <button type="button" className="p-2 text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">alternate_email</span>
                    </button>
                    <button type="submit" className="w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center hover:bg-primary-container transition-all active:scale-95 shadow-sm">
                      <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                  </div>
                </div>
              </form>
              <div className="mt-4 flex justify-between px-2">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1.5 text-[10px] font-bold text-outline uppercase tracking-wider hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">schedule</span> Set Reminder
                  </button>
                  <button className="flex items-center gap-1.5 text-[10px] font-bold text-outline uppercase tracking-wider hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">video_call</span> Start Huddle
                  </button>
                </div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Markdown Supported</span>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
