import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'

function WorkerPage({ tasks = [] }) {
    const navigate = useNavigate()

    const handleToggle = async (taskId, currentCompletedValue) => {
        try {
            await updateDoc(doc(db, 'tasks', taskId), {
                completed: !currentCompletedValue,
                completedAt: !currentCompletedValue ? new Date().toISOString() : null,
            })
        } catch (error) {
            console.error('Error updating task:', error)
        }
    }

    const sections = [
        { key: 'one-time', title: 'Today' },
        { key: 'daily', title: 'Daily' },
        { key: 'weekly', title: 'Weekly' },
        { key: 'monthly', title: 'Monthly' },
    ]

    return (
        <div className="page-container">
            <h1 className="page-title">
                <span onClick={() => navigate('/admin')}>
                    Worker Page
                </span>
            </h1>

            <p className="page-subtitle">Today's Tasks</p>

            {tasks.length === 0 ? (
                <p className="empty-text">No tasks available</p>
            ) : (
                <div>
                    {sections.map((section) => {
                        const sectionTasks = tasks.filter(
                            (task) => task.type === section.key
                        )

                        if (sectionTasks.length === 0) return null

                        return (
                            <div key={section.key}>
                                <h2 className="section-title">{section.title}</h2>

                                <div className="tasks-list">
                                    {sectionTasks.map((task) => (
                                        <div key={task.id} className="task-card">
                                            <label className="worker-task">
                                                <input
                                                    type="checkbox"
                                                    checked={!!task.completed}
                                                    onChange={() =>
                                                        handleToggle(task.id, task.completed)
                                                    }
                                                />

                                                <div>
                                                    <span
                                                        className={`worker-task-text ${
                                                            task.completed ? 'completed' : ''
                                                        }`}
                                                    >
                                                        {task.title}
                                                    </span>

                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default WorkerPage