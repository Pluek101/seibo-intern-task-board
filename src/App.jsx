import { useState, useEffect } from 'react'
import './App.css'

// Initial data
const initialInterns = [
  { id: 1, name: 'Sarah Chen', role: 'Social Media', email: 'sarah@seibo.org', avatar: 'SC' },
  { id: 2, name: 'Marcus Johnson', role: 'Events', email: 'marcus@seibo.org', avatar: 'MJ' },
  { id: 3, name: 'Emily Rodriguez', role: 'Fundraising', email: 'emily@seibo.org', avatar: 'ER' },
  { id: 4, name: 'David Kim', role: 'Research', email: 'david@seibo.org', avatar: 'DK' },
]

const initialTasks = [
  { id: 1, title: 'Design Q2 Campaign Graphics', description: 'Create visual assets for summer fundraising campaign', owner: 1, category: 'content', priority: 'high', status: 'in-progress', dueDate: '2026-05-01' },
  { id: 2, title: 'Prepare Board Meeting Slides', description: 'Quarterly progress report presentation', owner: 3, category: 'admin', priority: 'urgent', status: 'todo', dueDate: '2026-04-28' },
  { id: 3, title: 'Update Volunteer Handbook', description: 'Add new safety protocols and guidelines', owner: 2, category: 'admin', priority: 'medium', status: 'review', dueDate: '2026-05-05' },
  { id: 4, title: 'LinkedIn Post Series', description: '3-part series on NGO impact stories', owner: 1, category: 'social', priority: 'medium', status: 'done', dueDate: '2026-04-20' },
  { id: 5, title: 'Research Grant Opportunities', description: 'Find potential funders for education program', owner: 4, category: 'fundraising', priority: 'high', status: 'in-progress', dueDate: '2026-05-10' },
  { id: 6, title: 'Event Follow-up Emails', description: 'Send thank yous to donors from charity gala', owner: 2, category: 'outreach', priority: 'low', status: 'todo', dueDate: '2026-05-15' },
]

const initialHandoffs = [
  { id: 1, fromIntern: 1, toIntern: 2, task: 'Instagram Campaign Setup', status: 'pending', notes: 'Need access to business account', createdAt: '2026-04-20' },
  { id: 2, fromIntern: 3, toIntern: 4, task: 'Donor Database Update', status: 'completed', notes: 'All records migrated', createdAt: '2026-04-15' },
]

const initialSocialPosts = [
  { id: 1, platform: 'linkedin', content: 'Seibo Foundation is proud to announce our new education initiative!', scheduledDate: '2026-04-28', status: 'scheduled', owner: 1 },
  { id: 2, platform: 'instagram', content: 'Meet our amazing volunteers making a difference.', scheduledDate: '2026-04-30', status: 'draft', owner: 1 },
  { id: 3, platform: 'twitter', content: 'Thank you to all our donors for your continued support!', scheduledDate: '2026-04-25', status: 'published', owner: 2 },
]

const categories = ['admin', 'content', 'social', 'fundraising', 'outreach', 'events', 'research']
const priorities = ['low', 'medium', 'high', 'urgent']
const statuses = ['todo', 'in-progress', 'review', 'done']

// Storage helpers
const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [tasks, setTasks] = useState(() => loadFromStorage('tasks', initialTasks))
  const [interns] = useState(initialInterns)
  const [handoffs, setHandoffs] = useState(() => loadFromStorage('handoffs', initialHandoffs))
  const [socialPosts, setSocialPosts] = useState(() => loadFromStorage('socialPosts', initialSocialPosts))
  
  // Filters
  const [filterOwner, setFilterOwner] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Modal state
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [showHandoffModal, setShowHandoffModal] = useState(false)
  const [showSocialModal, setShowSocialModal] = useState(false)
  
  // Form state
  const [taskForm, setTaskForm] = useState({ title: '', description: '', owner: '', category: 'admin', priority: 'medium', status: 'todo', dueDate: '' })
  const [handoffForm, setHandoffForm] = useState({ fromIntern: '', toIntern: '', task: '', notes: '' })
  const [socialForm, setSocialForm] = useState({ platform: 'linkedin', content: '', scheduledDate: '', status: 'draft', owner: '' })

  // Save to localStorage on changes
  useEffect(() => saveToStorage('tasks', tasks), [tasks])
  useEffect(() => saveToStorage('handoffs', handoffs), [handoffs])
  useEffect(() => saveToStorage('socialPosts', socialPosts), [socialPosts])

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filterOwner !== 'all' && task.owner !== parseInt(filterOwner)) return false
    if (filterCategory !== 'all' && task.category !== filterCategory) return false
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false
    if (filterStatus !== 'all' && task.status !== filterStatus) return false
    return true
  })

  // Task CRUD
  const handleSaveTask = () => {
    if (!taskForm.title || !taskForm.owner) return alert('Title and Owner are required')
    
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...taskForm, id: editingTask.id } : t))
    } else {
      setTasks([...tasks, { ...taskForm, id: Date.now() }])
    }
    closeTaskModal()
  }

  const handleDeleteTask = (id) => {
    if (confirm('Delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id))
    }
  }

  const handleMoveTask = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  const openTaskModal = (task = null) => {
    if (task) {
      setEditingTask(task)
      setTaskForm(task)
    } else {
      setEditingTask(null)
      setTaskForm({ title: '', description: '', owner: '', category: 'admin', priority: 'medium', status: 'todo', dueDate: '' })
    }
    setShowTaskModal(true)
  }

  const closeTaskModal = () => {
    setShowTaskModal(false)
    setEditingTask(null)
  }

  // Handoff CRUD
  const handleSaveHandoff = () => {
    if (!handoffForm.fromIntern || !handoffForm.toIntern || !handoffForm.task) return alert('All fields required')
    setHandoffs([...handoffs, { ...handoffForm, id: Date.now(), status: 'pending', createdAt: new Date().toISOString().split('T')[0] }])
    setShowHandoffModal(false)
    setHandoffForm({ fromIntern: '', toIntern: '', task: '', notes: '' })
  }

  const handleUpdateHandoffStatus = (id, status) => {
    setHandoffs(handoffs.map(h => h.id === id ? { ...h, status } : h))
  }

  const handleDeleteHandoff = (id) => {
    if (confirm('Delete this handover?')) {
      setHandoffs(handoffs.filter(h => h.id !== id))
    }
  }

  // Social Post CRUD
  const handleSaveSocialPost = () => {
    if (!socialForm.content || !socialForm.owner) return alert('Content and Owner are required')
    setSocialPosts([...socialPosts, { ...socialForm, id: Date.now() }])
    setShowSocialModal(false)
    setSocialForm({ platform: 'linkedin', content: '', scheduledDate: '', status: 'draft', owner: '' })
  }

  const handleDeleteSocialPost = (id) => {
    if (confirm('Delete this post?')) {
      setSocialPosts(socialPosts.filter(p => p.id !== id))
    }
  }

  const getInternName = (id) => interns.find(i => i.id === id)?.name || 'Unknown'
  const getInternAvatar = (id) => interns.find(i => i.id === id)?.avatar || '?'

  // Stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#2d7a4f', color: 'white', padding: '1rem' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#2d7a4f', fontWeight: 'bold', fontSize: '1.25rem' }}>S</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Seibo Intern Task Board</h1>
          </div>
          <nav className="flex gap-1 flex-wrap justify-center">
            {['dashboard', 'kanban', 'interns', 'handoff', 'social'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                style={{ color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.8)', borderBottomColor: activeTab === tab ? 'white' : 'transparent', textTransform: 'capitalize', padding: '0.5rem 1rem' }}
              >
                {tab === 'social' ? 'SNS Tracker' : tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="animate-fadeIn">
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#2c3e50' }}>Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#6c757d' }}>{stats.todo}</div>
                <div className="stat-label">To Do</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#007bff' }}>{stats.inProgress}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#28a745' }}>{stats.done}</div>
                <div className="stat-label">Done</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#dc3545' }}>{stats.urgent}</div>
                <div className="stat-label">Urgent</div>
              </div>
            </div>

            {/* Filters */}
            <div className="card mb-6">
              <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Filters</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select className="select" value={filterOwner} onChange={e => setFilterOwner(e.target.value)}>
                  <option value="all">All Owners</option>
                  {interns.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
                <select className="select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <select className="select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                  <option value="all">All Priorities</option>
                  {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
                <select className="select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">All Statuses</option>
                  {statuses.map(s => <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                </select>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 style={{ margin: 0 }}>Recent Tasks</h3>
                <button className="btn btn-primary" onClick={() => openTaskModal()}>+ Add Task</button>
              </div>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Task</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Owner</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Category</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Priority</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Due</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.slice(0, 10).map(task => (
                      <tr key={task.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: 500 }}>{task.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{task.description?.slice(0, 50)}</div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div className="intern-avatar" style={{ width: '2rem', height: '2rem', fontSize: '0.75rem' }}>
                            {getInternAvatar(task.owner)}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem' }}><span className="badge" style={{ backgroundColor: '#e9ecef', color: '#495057' }}>{task.category}</span></td>
                        <td style={{ padding: '0.75rem' }}><span className={`badge badge-${task.priority}`}>{task.priority}</span></td>
                        <td style={{ padding: '0.75rem' }}><span className={`badge status-${task.status}`}>{task.status.replace('-', ' ')}</span></td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{task.dueDate || '-'}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <button onClick={() => openTaskModal(task)} style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }}>Edit</button>
                          <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        {activeTab === 'kanban' && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: '1.75rem', margin: 0, color: '#2c3e50' }}>Kanban Board</h2>
              <button className="btn btn-primary" onClick={() => openTaskModal()}>+ Add Task</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {statuses.map(status => (
                <div key={status} className="kanban-column">
                  <h3 style={{ margin: '0 0 1rem 0', textTransform: 'capitalize', color: '#495057', fontSize: '1rem' }}>
                    {status.replace('-', ' ')} ({tasks.filter(t => t.status === status).length})
                  </h3>
                  {filteredTasks.filter(t => t.status === status).map(task => (
                    <div key={task.id} className="kanban-card">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`badge badge-${task.priority}`} style={{ fontSize: '0.625rem' }}>{task.priority}</span>
                        <div className="flex gap-1">
                          <select
                            value={task.status}
                            onChange={e => handleMoveTask(task.id, e.target.value)}
                            className="select"
                            style={{ padding: '0.25rem', fontSize: '0.625rem', width: 'auto' }}
                          >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{task.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.5rem' }}>{task.description?.slice(0, 60)}</div>
                      <div className="flex justify-between items-center">
                        <div className="intern-avatar" style={{ width: '1.5rem', height: '1.5rem', fontSize: '0.5rem' }}>
                          {getInternAvatar(task.owner)}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => openTaskModal(task)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff', fontSize: '0.75rem' }}>Edit</button>
                          <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', fontSize: '0.75rem' }}>×</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Intern List */}
        {activeTab === 'interns' && (
          <div className="animate-fadeIn">
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#2c3e50' }}>Intern List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {interns.map(intern => (
                <div key={intern.id} className="card" style={{ textAlign: 'center' }}>
                  <div className="intern-avatar" style={{ width: '4rem', height: '4rem', fontSize: '1.25rem', margin: '0 auto 1rem' }}>
                    {intern.avatar}
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{intern.name}</h3>
                  <p style={{ margin: 0, color: '#6c757d', fontSize: '0.875rem' }}>{intern.role}</p>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#6c757d', fontSize: '0.75rem' }}>{intern.email}</p>
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e9ecef' }}>
                    <span style={{ fontSize: '0.875rem' }}>{tasks.filter(t => t.owner === intern.id).length} tasks assigned</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Handover Tracker */}
        {activeTab === 'handoff' && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: '1.75rem', margin: 0, color: '#2c3e50' }}>Handover Tracker</h2>
              <button className="btn btn-primary" onClick={() => setShowHandoffModal(true)}>+ Add Handover</button>
            </div>
            <div className="grid gap-4">
              {handoffs.map(handoff => (
                <div key={handoff.id} className="card">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="intern-avatar" style={{ width: '2rem', height: '2rem', fontSize: '0.75rem' }}>
                          {getInternAvatar(handoff.fromIntern)}
                        </div>
                        <span style={{ color: '#6c757d' }}>→</span>
                        <div className="intern-avatar" style={{ width: '2rem', height: '2rem', fontSize: '0.75rem', backgroundColor: '#f4a261' }}>
                          {getInternAvatar(handoff.toIntern)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{handoff.task}</span>
                      </div>
                      <p style={{ margin: 0, color: '#6c757d', fontSize: '0.875rem' }}>{handoff.notes}</p>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#6c757d', fontSize: '0.75rem' }}>Created: {handoff.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        className="select"
                        style={{ width: 'auto' }}
                        value={handoff.status}
                        onChange={e => handleUpdateHandoffStatus(handoff.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button onClick={() => handleDeleteHandoff(handoff.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', fontSize: '1.25rem' }}>×</button>
                    </div>
                  </div>
                </div>
              ))}
              {handoffs.length === 0 && <p style={{ color: '#6c757d', textAlign: 'center' }}>No handoffs yet</p>}
            </div>
          </div>
        )}

        {/* Social Media Tracker */}
        {activeTab === 'social' && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: '1.75rem', margin: 0, color: '#2c3e50' }}>LinkedIn/SNS Content Tracker</h2>
              <button className="btn btn-primary" onClick={() => setShowSocialModal(true)}>+ Add Post</button>
            </div>
            <div className="grid gap-4">
              {socialPosts.map(post => (
                <div key={post.id} className="card">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge" style={{ 
                          backgroundColor: post.platform === 'linkedin' ? '#0077b5' : post.platform === 'instagram' ? '#e4405f' : '#1da1f2',
                          color: 'white'
                        }}>{post.platform}</span>
                        <span className={`badge ${post.status === 'published' ? 'badge-low' : post.status === 'scheduled' ? 'badge-medium' : 'status-todo'}`}>
                          {post.status}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 0.5rem 0' }}>{post.content}</p>
                      <p style={{ margin: 0, color: '#6c757d', fontSize: '0.875rem' }}>
                        Scheduled: {post.scheduledDate || 'Not set'} • Owner: {getInternName(post.owner)}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteSocialPost(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', fontSize: '1.25rem' }}>×</button>
                  </div>
                </div>
              ))}
              {socialPosts.length === 0 && <p style={{ color: '#6c757d', textAlign: 'center' }}>No posts yet</p>}
            </div>
          </div>
        )}
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={closeTaskModal}>
          <div className="modal-content animate-fadeIn" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
            <div className="grid gap-4">
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title *</label>
                <input className="input" type="text" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                <textarea className="input" rows={3} value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Task description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Owner *</label>
                  <select className="select" value={taskForm.owner} onChange={e => setTaskForm({ ...taskForm, owner: parseInt(e.target.value) })}>
                    <option value="">Select owner</option>
                    {interns.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
                  <select className="select" value={taskForm.category} onChange={e => setTaskForm({ ...taskForm, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Priority</label>
                  <select className="select" value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                    {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Status</label>
                  <select className="select" value={taskForm.status} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}>
                    {statuses.map(s => <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Due Date</label>
                <input className="input" type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
              </div>
              <div className="flex gap-2 justify-end">
                <button className="btn btn-secondary" onClick={closeTaskModal}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveTask}>{editingTask ? 'Update' : 'Create'} Task</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Handoff Modal */}
      {showHandoffModal && (
        <div className="modal-overlay" onClick={() => setShowHandoffModal(false)}>
          <div className="modal-content animate-fadeIn" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Add New Handover</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>From *</label>
                  <select className="select" value={handoffForm.fromIntern} onChange={e => setHandoffForm({ ...handoffForm, fromIntern: parseInt(e.target.value) })}>
                    <option value="">Select intern</option>
                    {interns.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>To *</label>
                  <select className="select" value={handoffForm.toIntern} onChange={e => setHandoffForm({ ...handoffForm, toIntern: parseInt(e.target.value) })}>
                    <option value="">Select intern</option>
                    {interns.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Task *</label>
                <input className="input" type="text" value={handoffForm.task} onChange={e => setHandoffForm({ ...handoffForm, task: e.target.value })} placeholder="Task to be handed over" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Notes</label>
                <textarea className="input" rows={2} value={handoffForm.notes} onChange={e => setHandoffForm({ ...handoffForm, notes: e.target.value })} placeholder="Additional notes" />
              </div>
              <div className="flex gap-2 justify-end">
                <button className="btn btn-secondary" onClick={() => setShowHandoffModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveHandoff}>Create Handover</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Post Modal */}
      {showSocialModal && (
        <div className="modal-overlay" onClick={() => setShowSocialModal(false)}>
          <div className="modal-content animate-fadeIn" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Add New Post</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Platform</label>
                  <select className="select" value={socialForm.platform} onChange={e => setSocialForm({ ...socialForm, platform: e.target.value })}>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Status</label>
                  <select className="select" value={socialForm.status} onChange={e => setSocialForm({ ...socialForm, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content *</label>
                <textarea className="input" rows={4} value={socialForm.content} onChange={e => setSocialForm({ ...socialForm, content: e.target.value })} placeholder="Post content..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Scheduled Date</label>
                  <input className="input" type="date" value={socialForm.scheduledDate} onChange={e => setSocialForm({ ...socialForm, scheduledDate: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Owner *</label>
                  <select className="select" value={socialForm.owner} onChange={e => setSocialForm({ ...socialForm, owner: parseInt(e.target.value) })}>
                    <option value="">Select owner</option>
                    {interns.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button className="btn btn-secondary" onClick={() => setShowSocialModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveSocialPost}>Create Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
