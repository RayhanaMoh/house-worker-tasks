import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import {useNavigate} from "react-router-dom";

function WorkerPage({ tasks }) {
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

    const groupTasks={
        'one-time': [],
        'daily': [],
        'weekly': [],
        'monthly': []
    }
    tasks.forEach(task => {
        if(groupTasks[task.type]){
            groupTasks[task.type].push(task)
        }
    })

    return (
        <div className="page-container">
            <h1 className="page-title">
                <span
                    onClick={() => navigate('/admin')}>
                    Worker Page
                </span>
            </h1>

            <p className="page-subtitle">Today's Tasks</p>

            {tasks.length === 0 ? (
                <p className="empty-text">No tasks available</p>
            ) : (
                <div className="tasks-list">
                    {Object.entries(groupedTasks).map(([type, group]) =>
                        group.length > 0 ? (
                            <div key={type}>
                                <h2 className="section-title">
                                    {type === 'one-time' && 'Today'}
                                    {type === 'daily' && 'Daily'}
                                    {type === 'weekly' && 'Weekly'}
                                    {type === 'monthly' && 'Monthly'}
                                </h2>

                                <div className="tasks-list">
                                    {tasks.map((task) => (
                                        <div key={task.id} className="task-card">
                                            <label className="worker-task">
                                                <input
                                                    type="checkbox"
                                                    checked={!!task.completed}
                                                    onChange={() => handleToggle(task.id, task.completed)}
                                                />
                                                <div>

                                                <span className={`worker-task-text ${task.completed ? 'completed' : ''}`}>
                                                  {task.title}
                                                </span>

                                                    <p className="task-meta">Type: {task.type || 'No type'}</p>

                                                </div>
                                            </label>
                                        </div>
                                     ))}
                                </div>
                            </div>
                        ) : null
                     )}
                </div>
            )}
        </div>
    )
}

export default WorkerPage