'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

type UserComment = {
  id: string;
  title: string;
  author: string;
  replies: number;
  likes: number;
  timeAgo: string;
  tags: string[];
  excerpt: string;
  isModeratorPresent: boolean;
  replyList: string[];
  isUser: true;
  userIdx: number;
};

type ForumPost = {
  id: number;
  title: string;
  author: string;
  replies: number;
  likes: number;
  timeAgo: string;
  tags: string[];
  excerpt: string;
  isModeratorPresent: boolean;
  isUser: false;
};

type CommentType = UserComment | ForumPost;

export default function PeerSection() {
  const [selectedTab, setSelectedTab] = useState('recent');
  const [myComments, setMyComments] = useState<Array<{ text: string; likes: number; replies: string[] }>>([]);
  const [commentInput, setCommentInput] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});

  const forumPosts = [
    {
      id: 1,
      title: "I'm feeling overwhelmed with exam stress, anyone else?",
      author: 'Anonymous Student',
      replies: 24,
      likes: 12,
      timeAgo: '2 hours ago',
      tags: ['exam-stress', 'anxiety'],
      excerpt:
        "Finals are coming up and I can't seem to focus. Every time I try to study, I feel like I'm drowning...",
      isModeratorPresent: true,
    },
    {
      id: 2,
      title: 'Tips for managing social anxiety on campus?',
      author: 'Anonymous Student',
      replies: 18,
      likes: 8,
      timeAgo: '5 hours ago',
      tags: ['social-anxiety', 'campus-life'],
      excerpt:
        'Starting my second year and still struggling to make friends. Any advice from fellow introverts?',
      isModeratorPresent: false,
    },
    {
      id: 3,
      title: 'Feeling isolated in my dorm - how to connect?',
      author: 'Anonymous Student',
      replies: 31,
      likes: 16,
      timeAgo: '1 day ago',
      tags: ['loneliness', 'dorm-life'],
      excerpt: 'My roommate is never here and I spend most evenings alone. Missing home a lot...',
      isModeratorPresent: true,
    },
  ];

  const moderators = [
    { name: 'Sarah M.', speciality: 'Peer Counselor', online: true },
    { name: 'Alex R.', speciality: 'Psychology Major', online: true },
    { name: 'Jamie L.', speciality: 'Mental Health Advocate', online: false },
  ];

  const communityStats = [
    { label: 'Active Members', value: '1,247', icon: 'material-symbols:group' },
    { label: 'Support Threads', value: '892', icon: 'material-symbols:forum' },
    { label: 'Trained Moderators', value: '24', icon: 'material-symbols:verified-user' },
    { label: 'Success Stories', value: '156', icon: 'mdi:heart' },
  ];

  const tabs = [
    { id: 'recent', name: 'Recent Posts', icon: 'mdi:clock-outline' },
    { id: 'popular', name: 'Most Helpful', icon: 'mdi:thumb-up-outline' },
    { id: 'support', name: 'Need Support', icon: 'mdi:hand-heart' },
  ];

  // Combine forum posts and user comments for display
  const allComments: CommentType[] = [
    ...myComments.map(
      (c, idx): UserComment => ({
        id: `my-${idx}`,
        title: c.text,
        author: 'You (Anonymous)',
        replies: c.replies.length,
        likes: c.likes,
        timeAgo: 'Just now',
        tags: ['user-comment'],
        excerpt: c.text,
        isModeratorPresent: false,
        replyList: c.replies,
        isUser: true,
        userIdx: idx,
      })
    ),
    ...forumPosts.map(
      (post): ForumPost =>
        ({
          ...post,
          isUser: false,
        }) as ForumPost
    ),
  ];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      setMyComments([{ text: commentInput.trim(), likes: 0, replies: [] }, ...myComments]);
      setCommentInput('');
    }
  };

  const handleLike = (idx: number) => {
    setMyComments((comments) => comments.map((c, i) => (i === idx ? { ...c, likes: c.likes + 1 } : c)));
  };

  const handleReplyInput = (id: string, value: string) => {
    setReplyInputs((inputs) => ({ ...inputs, [id]: value }));
  };

  const handleReply = (idx: number, id: string) => {
    const replyText = replyInputs[id]?.trim();
    if (replyText) {
      setMyComments((comments) =>
        comments.map((c, i) => (i === idx ? { ...c, replies: [replyText, ...c.replies] } : c))
      );
      setReplyInputs((inputs) => ({ ...inputs, [id]: '' }));
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="community">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100/50 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon icon="material-symbols:diversity-3" />
            Peer Support Community
          </div>
          <h2 className="font-poppins font-medium text-4xl text-slate-800 mb-4">You&apos;re Not Alone in This Journey</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Connect with fellow students, share experiences, and support each other in a safe, moderated environment with
            trained peer volunteers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Community Stats & Moderators */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
              <h3 className="font-poppins font-medium text-lg text-slate-800 mb-4">Community Impact</h3>
              <div className="space-y-4">
                {communityStats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Icon icon={stat.icon} className="text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{stat.value}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Online Moderators */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="material-symbols:verified-user" className="text-green-600" />
                <h3 className="font-poppins font-medium text-lg text-slate-800">Trained Moderators</h3>
              </div>
              <div className="space-y-3">
                {moderators.map((moderator) => (
                  <div key={moderator.name} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{moderator.name.split(' ')}</span>
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          moderator.online ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{moderator.name}</div>
                      <div className="text-xs text-slate-600">{moderator.speciality}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-orange-500/20 text-orange-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition-colors">
                Become a Moderator
              </button>
            </div>
          </motion.div>

          {/* Forum Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedTab === tab.id ? 'bg-orange-500 text-white shadow-lg' : 'bg-white/20 text-slate-700 hover:bg-white/30'
                  }`}
                >
                  <Icon icon={tab.icon} className="text-sm" />
                  {tab.name}
                </button>
              ))}
            </motion.div>

            {/* New Post Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="w-full bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-4 mb-6 text-left hover:bg-white/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Link
                  href="/community"
                  className="group relative inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-white text-sm shadow-lg transition-colors hover:bg-emerald-600"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:plus" className="text-white" />
                  </div>
                  <div>
                    <span className="text-slate-600 group-hover:text-slate-800 transition-colors">
                      Share what&apos;s on your mind... (Anonymous)
                    </span>
                  </div>
                </Link>
              </div>
            </motion.button>

            {/* Add Comment Box */}
            <form onSubmit={handleAddComment} className="mb-6 flex gap-2 items-center">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add your own anonymous comment..."
                className="flex-grow bg-white/30 border border-white/50 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-800"
              />
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Post
              </button>
            </form>

            {/* Forum Posts (including user comments) */}
            <div className="space-y-4">
              {allComments.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <Icon icon="material-symbols:person" className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{post.author}</div>
                        <div className="text-sm text-slate-600">{post.timeAgo}</div>
                      </div>
                    </div>
                    {post.isModeratorPresent && (
                      <div className="flex items-center gap-1 bg-green-100/50 text-green-700 px-2 py-1 rounded-full text-xs">
                        <Icon icon="material-symbols:verified-user" />
                        Moderated
                      </div>
                    )}
                  </div>

                  <h3 className="font-poppins font-medium text-lg text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 mb-4 line-clamp-2">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="bg-slate-200/50 text-slate-700 px-2 py-1 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:thumb-up-outline" />
                        {post.likes}
                        {/* Like button for user comments only */}
                        {post.isUser && isUserComment(post) && (
                          <button
                            onClick={() => handleLike(post.userIdx)}
                            className="ml-2 text-orange-500 hover:text-orange-700 font-bold"
                          >
                            Like
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:comment-outline" />
                        {post.replies}
                      </div>
                    </div>
                  </div>

                  {/* Replies for user comments only */}
                  {post.isUser && isUserComment(post) && (
                    <div className="mt-4">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleReply(post.userIdx, post.id.toString());
                        }}
                        className="flex gap-2 mb-2"
                      >
                        <input
                          type="text"
                          value={replyInputs[post.id.toString()] || ''}
                          onChange={(e) => handleReplyInput(post.id.toString(), e.target.value)}
                          placeholder="Reply to your comment..."
                          className="flex-grow bg-white/30 border border-white/50 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-800"
                        />
                        <button
                          type="submit"
                          className="bg-orange-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                        >
                          Reply
                        </button>
                      </form>
                      {post.replyList.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {post.replyList.map((r, i) => (
                            <div key={i} className="bg-white/40 rounded p-2 text-slate-700 text-sm">
                              {r}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            {/* End forum posts */}
          </div>
          {/* End forum content */}
        </div>
        {/* End grid */}
      </div>
      {/* End container */}
    </section>
  );
}

// Type guard for user comments
function isUserComment(post: CommentType): post is UserComment {
  return post.isUser === true;
}
