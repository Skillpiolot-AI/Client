import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';

export default function GroupChatPage() {
  const { groupId } = useParams();
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

  if (loading) return <div className="p-12 text-center text-secondary">Loading chat...</div>;

  return (
    <div className="flex flex-1 h-[calc(100vh-100px)] overflow-hidden bg-surface-container-low relative">
      <main className="flex-1 flex flex-col relative border-r border-outline-variant/10">
        {/* Header toolbar */}
        <section className="bg-surface-bright/90 backdrop-blur-md px-8 py-4 z-20 flex items-center justify-between shadow-sm border-b border-outline-variant/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-primary-container flex items-center justify-center font-bold text-white">
              {currentGroup?.name?.charAt(0) || 'G'}
            </div>
            <div>
              <h2 className="font-headline font-extrabold text-primary tracking-tight">{currentGroup?.name}</h2>
              <div className="flex items-center text-xs text-secondary font-medium space-x-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {groupMembers.length} Active</span>
                <span className="text-outline-variant">|</span>
                <span>{currentGroup?.category || 'General'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 no-scrollbar">
          {messages.map((msg) => {
            const isSelf = msg.sender === 'self';
            return (
              <div key={msg.id} className={`flex items-start gap-4 ${isSelf ? 'flex-row-reverse ml-auto max-w-2xl' : 'max-w-2xl'}`}>
                {!isSelf && (
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center font-bold text-primary shadow-sm">
                    {msg.senderName.charAt(0)}
                  </div>
                )}
                <div className={`space-y-1 ${isSelf ? 'flex flex-col items-end' : ''}`}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline font-bold text-sm text-primary">{msg.senderName}</span>
                    <span className="text-[10px] text-outline font-medium">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${isSelf ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-container-lowest text-on-surface-variant rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <section className="bg-surface-bright border-t border-outline-variant/10 p-6 z-30">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="relative group">
              <textarea 
                className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-6 pr-16 text-sm focus:ring-2 focus:ring-primary/20 resize-none font-medium placeholder:text-outline/60 outline-none" 
                placeholder="Share your thoughts..." 
                rows="1"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
              ></textarea>
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button type="submit" className="w-10 h-10 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl shadow-lg flex items-center justify-center hover:translate-y-[-1px] transition-all">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>

      {/* Right Side Info: Members */}
      <aside className="hidden xl:flex flex-col w-64 bg-surface h-full p-8 border-l border-outline-variant/10">
        <div>
          <h3 className="font-inter text-xs font-semibold uppercase tracking-[0.1em] text-outline mb-4">Channel Members</h3>
          <div className="space-y-4">
            {groupMembers.map((member) => (
              <div key={member._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-surface-container-highest rounded-xl flex items-center justify-center font-bold text-primary">
                    {member.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-on-surface-variant">{member.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
