import { useMemo, useRef, useState } from 'react'

const interns = [
  {
    id: 1,
    name: 'Pluek',
    period: 'May 18 to Jul 10',
    focus: ['AI Solutions', 'Digital Analytics', 'Task Management Platform', 'LinkedIn updates'],
  },
  {
    id: 2,
    name: 'Thomas',
    period: 'May 22 to Jul 21',
    focus: ['Translation', 'Moodle Development', 'PR TIMES Media List'],
  },
  {
    id: 3,
    name: 'Kealee C.',
    period: 'May 25 to Jul 06',
    focus: ['Marketing', 'Event Production', 'SNS Integration'],
  },
  {
    id: 4,
    name: 'Kendall Kennedy',
    period: 'Jun 01 to Jul 24',
    focus: ['Accounting', 'Data Analysis', 'Monthly Report', 'GA Analysis'],
  },
  {
    id: 5,
    name: 'Tyki A.',
    period: 'Jun 01 to Jun 26',
    focus: ['Youth Leadership', 'School Network', 'School Website'],
  },
  {
    id: 6,
    name: 'Emir Sekmen',
    period: 'Jun 08 to Jul 29',
    focus: ['Yamathon', 'Educational Marketing', 'Moodle Promotion'],
  },
  {
    id: 7,
    name: 'Adriene Creech',
    period: 'Jun 08 to Jul 16',
    focus: ['Monthly Report Improvement', 'English Community PR'],
  },
  {
    id: 8,
    name: 'Natalee Lee',
    period: 'Jun 16 to Jul 24',
    focus: ['Moodle Development', 'Business Pitching', 'SNS Consistency'],
  },
  {
    id: 9,
    name: 'Camelia Elaoufi',
    period: 'Jun 15 to Jul 24',
    focus: ['Course Site Editing', 'Preschool Profile'],
  },
  {
    id: 10,
    name: 'Madina Mohsini',
    period: 'Jun 22 to Aug 01',
    focus: ['School Site Development', 'SNS Integration', 'Event Promotion'],
  },
]

const handovers = [
  { id: 1, flow: 'Pluek → Kendall', topic: 'AI / Digital Analytics' },
  { id: 2, flow: 'Tyki → Madina', topic: 'School Website' },
  { id: 3, flow: 'Kealee → Natalee → Madina', topic: 'SNS Integration and Consistency' },
  { id: 4, flow: 'Thomas / Adriene / Natalee', topic: 'Moodle weekly progress sharing' },
  { id: 5, flow: 'Kealee → Emir / Madina', topic: 'Event promotion materials' },
]

const socialItems = [
  {
    id: 1,
    idea: 'LinkedIn profile optimization tips for interns',
    platform: 'LinkedIn',
    owner: 'Pluek',
    status: 'Draft',
    notes: 'Share before internship midpoint review.',
    link: '',
  },
  {
    id: 2,
    idea: 'Expat community networking story',
    platform: 'LinkedIn',
    owner: 'Adriene',
    status: 'In Review',
    notes: 'Include one quote from participants.',
    link: '',
  },
  {
    id: 3,
    idea: 'Fundraising campaign progress post',
    platform: 'LinkedIn',
    owner: 'Kendall',
    status: 'Planned',
    notes: 'Use monthly report data points.',
    link: '',
  },
  {
    id: 4,
    idea: 'Impact stories from school partners',
    platform: 'Instagram',
    owner: 'Tyki',
    status: 'Scheduled',
    notes: 'Prepare 3 slides + CTA.',
    link: '',
  },
  {
    id: 5,
    idea: 'Event promotion for Yamathon activities',
    platform: 'Instagram',
    owner: 'Emir',
    status: 'Draft',
    notes: 'Coordinate with Kealee and Madina assets.',
    link: '',
  },
  {
    id: 6,
    idea: 'Post analytics review',
    platform: 'LinkedIn',
    owner: 'Natalee',
    status: 'Done',
    notes: 'Summarize best-performing post themes.',
    link: 'https://www.linkedin.com/',
  },
  {
    id: 7,
    idea: 'Volunteer opportunity announcement',
    platform: 'LinkedIn',
    owner: 'Thomas',
    status: 'Planned',
    notes: 'Attach simple sign-up form link.',
    link: '',
  },
]

const statuses = ['todo', 'in-progress', 'blocked', 'done']
const priorities = ['low', 'medium', 'high']
const tabs = ['Task Board', 'Interns List', 'Handover Tracker', 'LinkedIn / SNS Tracker']
const storageKey = 'seibo_task_board_tasks_v1'

const initialTasks = [
  {
    id: 1,
    title: 'Set up weekly intern task board',
    owner: 'Pluek',
    dueDate: '2026-05-03',
    priority: 'high',
    notes: 'Keep columns simple for all teams.',
    status: 'in-progress',
  },
  {
    id: 2,
    title: 'Prepare Moodle progress summary',
    owner: 'Thomas',
    dueDate: '2026-05-07',
    priority: 'medium',
    notes: 'Share with Adriene and Natalee each Friday.',
    status: 'todo',
  },
  {
    id: 3,
    title: 'Review event promotion visual assets',
    owner: 'Kealee C.',
    dueDate: '2026-05-05',
    priority: 'medium',
    notes: 'Coordinate with Emir and Madina.',
    status: 'blocked',
  },
  {
    id: 4,
    title: 'Finalize internship monthly report template',
    owner: 'Kendall Kennedy',
    dueDate: '2026-05-01',
    priority: 'low',
    notes: 'Draft ready for Makoto review.',
    status: 'done',
  },
]

const emptyTask = {
  title: '',
  owner: '',
  dueDate: '',
  priority: 'medium',
  notes: '',
  status: 'todo',
}

const loadTasks = () => {
  if (typeof window === 'undefined') return initialTasks
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return initialTasks
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : initialTasks
  } catch {
    return initialTasks
  }
}

const saveTasks = (tasks) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(tasks))
  } catch (error) {
    console.warn('Could not persist tasks to localStorage', error)
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('Task Board')
  const [tasks, setTasks] = useState(loadTasks)
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [taskForm, setTaskForm] = useState(emptyTask)

  const nextTaskId = useRef(Math.max(...tasks.map((task) => task.id), 0) + 1)

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (ownerFilter !== 'all' && task.owner !== ownerFilter) return false
      if (statusFilter !== 'all' && task.status !== statusFilter) return false
      return true
    })
  }, [ownerFilter, statusFilter, tasks])

  const tasksByStatus = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = filteredTasks.filter((task) => task.status === status)
      return acc
    }, {})
  }, [filteredTasks])

  const updateTasks = (nextTasks) => {
    setTasks(nextTasks)
    saveTasks(nextTasks)
  }

  const openNewTaskForm = () => {
    setEditingTaskId(null)
    setTaskForm(emptyTask)
  }

  const openEditTaskForm = (task) => {
    setEditingTaskId(task.id)
    setTaskForm(task)
  }

  const submitTask = (event) => {
    event.preventDefault()
    if (!taskForm.title.trim() || !taskForm.owner) return

    if (editingTaskId) {
      updateTasks(tasks.map((task) => (task.id === editingTaskId ? { ...taskForm, id: editingTaskId } : task)))
    } else {
      updateTasks([...tasks, { ...taskForm, id: nextTaskId.current++ }])
    }

    setEditingTaskId(null)
    setTaskForm(emptyTask)
  }

  const deleteTask = (taskId) => {
    updateTasks(tasks.filter((task) => task.id !== taskId))
  }

  const changeTaskStatus = (taskId, nextStatus) => {
    updateTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task)))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Seibo Intern Task Platform</h1>
            <p className="text-sm text-slate-600">Simple Trello-style MVP for Seibo summer interns</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                  activeTab === tab
                    ? 'border-emerald-700 bg-emerald-700 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {activeTab === 'Task Board' && (
          <section className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Task Board</h2>
                <button
                  type="button"
                  onClick={openNewTaskForm}
                  className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                >
                  + Add Task
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Filter by owner
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    value={ownerFilter}
                    onChange={(event) => setOwnerFilter(event.target.value)}
                  >
                    <option value="all">All owners</option>
                    {interns.map((intern) => (
                      <option key={intern.id} value={intern.name}>
                        {intern.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Filter by status
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="all">All statuses</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <form onSubmit={submitTask} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">{editingTaskId ? 'Edit Task' : 'Add Task'}</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Title
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    value={taskForm.title}
                    onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
                    placeholder="Task title"
                    required
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Owner
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    value={taskForm.owner}
                    onChange={(event) => setTaskForm({ ...taskForm, owner: event.target.value })}
                    required
                  >
                    <option value="">Select owner</option>
                    {interns.map((intern) => (
                      <option key={intern.id} value={intern.name}>
                        {intern.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Due date
                  <input
                    type="date"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    value={taskForm.dueDate}
                    onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })}
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Priority
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    value={taskForm.priority}
                    onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700 md:col-span-2">
                  Notes
                  <textarea
                    rows={3}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    value={taskForm.notes}
                    onChange={(event) => setTaskForm({ ...taskForm, notes: event.target.value })}
                    placeholder="Optional notes"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Status
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    value={taskForm.status}
                    onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value })}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="submit" className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800">
                  {editingTaskId ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={openNewTaskForm}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Clear
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              {statuses.map((status) => (
                <div key={status} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{status.replace('-', ' ')}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{tasksByStatus[status]?.length ?? 0}</span>
                  </div>

                  <div className="space-y-3">
                    {(tasksByStatus[status] ?? []).map((task) => (
                      <article key={task.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                        <p className="mt-1 text-xs text-slate-600">Owner: {task.owner}</p>
                        <p className="text-xs text-slate-600">Due: {task.dueDate || 'Not set'}</p>
                        <p className="text-xs text-slate-600">Priority: {task.priority}</p>
                        {task.notes && <p className="mt-1 text-xs text-slate-600">Notes: {task.notes}</p>}

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <select
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                            value={task.status}
                            onChange={(event) => changeTaskStatus(task.id, event.target.value)}
                          >
                            {statuses.map((value) => (
                              <option key={value} value={value}>
                                {value.replace('-', ' ')}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => openEditTaskForm(task)}
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            className="rounded border border-rose-300 bg-white px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                    {(tasksByStatus[status] ?? []).length === 0 && <p className="text-xs text-slate-500">No tasks.</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Interns List' && (
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Interns List</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {interns.map((intern) => (
                <article key={intern.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-base font-semibold text-slate-900">{intern.name}</p>
                  <p className="text-sm text-slate-600">{intern.period}</p>
                  <p className="mt-2 text-sm text-slate-700">{intern.focus.join(', ')}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Handover Tracker' && (
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Handover Tracker</h2>
            <div className="space-y-3">
              {handovers.map((handover) => (
                <article key={handover.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">{handover.flow}</p>
                  <p className="text-sm text-slate-700">{handover.topic}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'LinkedIn / SNS Tracker' && (
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">LinkedIn / SNS Tracker</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-700">
                    <th className="px-2 py-2">Post Idea</th>
                    <th className="px-2 py-2">Platform</th>
                    <th className="px-2 py-2">Owner</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Notes</th>
                    <th className="px-2 py-2">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {socialItems.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 align-top">
                      <td className="px-2 py-2">{item.idea}</td>
                      <td className="px-2 py-2">{item.platform}</td>
                      <td className="px-2 py-2">{item.owner}</td>
                      <td className="px-2 py-2">{item.status}</td>
                      <td className="px-2 py-2">{item.notes}</td>
                      <td className="px-2 py-2">
                        {item.link ? (
                          <a className="text-emerald-700 underline" href={item.link} target="_blank" rel="noreferrer">
                            Open
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
