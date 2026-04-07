import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const tok = () => localStorage.getItem('token');

function timeSince(date) {
  const sec = Math.floor((Date.now() - new Date(date)) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

// ── Recursive Comment Thread ──────────────────────────────
function CommentThread({ comment, replies, allReplies, groupId, postId, depth = 0, onNewComment }) {
  const { user, isAuthenticated } = useAuth();
  const [score, setScore] = useState(comment.score || 0);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isDeleted, setIsDeleted] = useState(comment.isDeleted);
  const [collapsed, setCollapsed] = useState(false);

  const childComments = allReplies.filter(r => r.parent === comment._id || r.parent?._id === comment._id);

  const voteComment = async (v) => {
    if (!isAuthenticated()) return;
    try {
      const res = await fetch(`${API}/groups/${groupId}/posts/${postId}/comments/${comment._id}/vote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote: v }),
      });
      const data = await res.json();
      setScore(data.score ?? score);
    } catch {}
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    try {
      const res = await fetch(`${API}/groups/${groupId}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyText, parentId: comment._id }),
      });
      const data = await res.json();
      if (res.ok) {
        onNewComment(data.comment);
        setReplyText('');
        setShowReplyBox(false);
      }
    } catch {}
    setReplyLoading(false);
  };

  const reportComment = async () => {
    if (!reportReason.trim()) return;
    await fetch(`${API}/groups/${groupId}/posts/${postId}/comments/${comment._id}/report`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: reportReason }),
    });
    setShowReport(false);
    setReportReason('');
  };

  const deleteComment = async () => {
    if (!confirm('Delete this comment?')) return;
    await fetch(`${API}/groups/${groupId}/posts/${postId}/comments/${comment._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tok()}` },
    });
    setIsDeleted(true);
  };

  const INDENT_COLORS = ['border-primary/30', 'border-blue-300', 'border-green-300', 'border-yellow-300', 'border-pink-300', 'border-purple-300'];
  const indentColor = INDENT_COLORS[depth % INDENT_COLORS.length];

  return (
    <div className={`relative ${depth > 0 ? `ml-5 pl-4 border-l-2 ${indentColor}` : ''}`}>
      <div className="py-2">
        {/* Comment header */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
            {comment.author?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <span className="font-semibold text-on-surface">{comment.author?.name || '[deleted]'}</span>
          <span>·</span>
          <span>{timeSince(comment.createdAt)}</span>
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-outline-variant hover:text-on-surface transition-colors p-0.5 rounded">
            <span className="material-symbols-outlined text-sm">{collapsed ? 'expand_more' : 'remove'}</span>
          </button>
        </div>

        {!collapsed && (
          <>
            {/* Body */}
            <div className={`text-sm leading-relaxed mb-2 ml-8 ${isDeleted ? 'italic text-on-surface-variant' : 'text-on-surface'}`}>
              {isDeleted ? '[deleted]' : comment.body}
            </div>

            {/* Action row */}
            {!isDeleted && (
              <div className="flex items-center gap-1 ml-8 flex-wrap">
                <button onClick={() => voteComment(1)} className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  <span>{score}</span>
                </button>
                {isAuthenticated() && depth < 6 && (
                  <button onClick={() => setShowReplyBox(!showReplyBox)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-sm">reply</span>
                    Reply
                  </button>
                )}
                {isAuthenticated() && (
                  <button onClick={() => setShowReport(!showReport)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors">
                    <span className="material-symbols-outlined text-sm">flag</span>
                    Report
                  </button>
                )}
                {user && comment.author?._id === (user._id || user.id) && (
                  <button onClick={deleteComment} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Delete
                  </button>
                )}
              </div>
            )}

            {/* Reply input */}
            {showReplyBox && (
              <div className="ml-8 mt-2">
                <textarea
                  rows={2} value={replyText} onChange={e => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={submitReply} disabled={!replyText.trim() || replyLoading}
                    className="px-4 py-1.5 rounded-lg bg-primary !text-black text-xs font-bold disabled:opacity-50">
                    {replyLoading ? 'Replying...' : 'Reply'}
                  </button>
                  <button onClick={() => setShowReplyBox(false)} className="px-4 py-1.5 rounded-lg border border-outline-variant text-xs font-bold text-on-surface-variant">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Report box */}
            {showReport && (
              <div className="ml-8 mt-2 p-3 bg-red-50 rounded-xl border border-red-200">
                <p className="text-xs font-bold text-red-700 mb-2">Report reason</p>
                <input type="text" value={reportReason} onChange={e => setReportReason(e.target.value)}
                  placeholder="Spam, harassment, misinformation..."
                  className="w-full text-xs px-3 py-1.5 rounded-lg outline-none border border-red-200 mb-2"
                />
                <button onClick={reportComment} className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold">Submit Report</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recursive children */}
      {!collapsed && childComments.map(child => (
        <CommentThread
          key={child._id}
          comment={child}
          replies={[]}
          allReplies={allReplies}
          groupId={groupId}
          postId={postId}
          depth={depth + 1}
          onNewComment={onNewComment}
        />
      ))}
    </div>
  );
}

// ── PostDetailPage ─────────────────────────────────────────
export default function PostDetailPage() {
  const params = useParams();
  const groupId = params.groupId || params.id;
  const postId = params.postId;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [allReplies, setAllReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [score, setScore] = useState(0);
  const [userVote, setUserVote] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/groups/${groupId}/posts/${postId}`).then(r => r.json()),
      fetch(`${API}/groups/${groupId}/posts/${postId}/comments`).then(r => r.json()),
    ]).then(([postData, commentData]) => {
      setPost(postData.post);
      setScore(postData.post?.score || 0);
      setComments(commentData.comments || []);
      setAllReplies(commentData.replies || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [groupId, postId]);

  const votePost = async (v) => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    const newVote = userVote === v ? 0 : v;
    const res = await fetch(`${API}/groups/${groupId}/posts/${postId}/vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote: newVote }),
    });
    const data = await res.json();
    setScore(data.score);
    setUserVote(newVote);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated()) return;
    setCommenting(true);
    const res = await fetch(`${API}/groups/${groupId}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: commentText }),
    });
    const data = await res.json();
    if (res.ok) {
      setComments(prev => [data.comment, ...prev]);
      setCommentText('');
    }
    setCommenting(false);
  };

  const handleNewReply = (reply) => {
    setAllReplies(prev => [...prev, reply]);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!post) return <div className="p-10 text-center text-on-surface-variant">Post not found.</div>;

  return (
    <div className="pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
        <Link to="/groups" className="hover:text-primary transition-colors">Groups</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to={`/groups/${groupId}`} className="hover:text-primary transition-colors">{post.group?.name || 'Community'}</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-on-surface font-semibold">Post</span>
      </nav>

      {/* Post Card */}
      <div className="bg-white rounded-2xl border border-outline-variant/10 shadow-sm flex mb-6 overflow-hidden">
        {/* Vote column */}
        <div className="flex flex-col items-center py-4 px-3 bg-surface-container-low gap-1 min-w-[52px]">
          <button onClick={() => votePost(1)} className={`p-1.5 rounded-lg transition-colors ${userVote === 1 ? 'text-orange-500' : 'text-outline-variant hover:text-orange-400'}`}>
            <span className="material-symbols-outlined text-2xl">arrow_upward</span>
          </button>
          <span className={`text-lg font-black ${score > 0 ? 'text-orange-500' : score < 0 ? 'text-blue-500' : 'text-on-surface-variant'}`}>{score}</span>
          <button onClick={() => votePost(-1)} className={`p-1.5 rounded-lg transition-colors ${userVote === -1 ? 'text-blue-500' : 'text-outline-variant hover:text-blue-400'}`}>
            <span className="material-symbols-outlined text-2xl">arrow_downward</span>
          </button>
        </div>

        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-3 flex-wrap">
            {post.subGroup && (
              <Link to={`/groups/${groupId}?sub=${post.subGroup._id}`} className="font-bold text-primary hover:underline">/{post.subGroup.slug}</Link>
            )}
            <span>Posted by <span className="font-semibold text-on-surface">{post.author?.name}</span></span>
            <span>·</span><span>{timeSince(post.createdAt)}</span>
            {post.flair && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{post.flair}</span>}
          </div>

          <h1 className="font-headline font-extrabold text-xl mb-4 leading-relaxed text-on-surface whitespace-pre-line">{post.body}</h1>


          <div className="flex items-center gap-2">
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-sm">share</span>Share
            </button>
          </div>
        </div>
      </div>

      {/* Comment Input */}
      {isAuthenticated() ? (
        <form onSubmit={submitComment} className="bg-white rounded-2xl p-4 mb-6 border border-outline-variant/10 shadow-sm">
          <p className="text-xs font-bold text-on-surface-variant mb-2">Comment as <span className="text-primary">{user?.name}</span></p>
          <textarea
            rows={3} value={commentText} onChange={e => setCommentText(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none mb-3"
          />
          <div className="flex justify-end">
            <button type="submit" disabled={!commentText.trim() || commenting}
              className="px-6 py-2 rounded-xl bg-primary !text-black text-sm font-bold disabled:opacity-50">
              {commenting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl p-4 mb-6 border border-outline-variant/10 text-center">
          <p className="text-sm text-on-surface-variant mb-2">Log in to join the discussion.</p>
          <Link to="/login" className="text-primary font-bold text-sm hover:underline">Log In</Link>
        </div>
      )}

      {/* Comments header */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-headline font-bold text-lg">{comments.length + allReplies.length} Comments</h2>
      </div>

      {/* Comment Thread */}
      <div className="bg-white rounded-2xl border border-outline-variant/10 shadow-sm p-4 divide-y divide-outline-variant/10 space-y-1">
        {comments.length === 0 ? (
          <div className="py-10 text-center text-on-surface-variant text-sm">No comments yet. Be the first!</div>
        ) : (
          comments.map(comment => (
            <CommentThread
              key={comment._id}
              comment={comment}
              replies={[]}
              allReplies={allReplies}
              groupId={groupId}
              postId={postId}
              depth={0}
              onNewComment={handleNewReply}
            />
          ))
        )}
      </div>
    </div>
  );
}
