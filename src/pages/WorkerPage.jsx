import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import {useNavigate} from "react-router-dom";

function WorkerPage({ tasks }) {
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

    const navigate = useNavigate()

    return (
        <div className="page-container">
            <h1 className="page-title">
                <span
                    onClick={() => navigate('/admin')}
                >
                    Worker Page
                </span>
            </h1>
            <p className="page-subtitle">Today's Tasks</p>

            {tasks.length === 0 ? (
                <p className="empty-text">No tasks available</p>
            ) : (
                <div className="tasks-list">
                    {tasks.map((task) => (
                        <div key={task.id} className="task-card">
                            <label className="worker-task">
                                <input
                                    type="checkbox"
                                    checked={!!task.completed}
                                    onChange={() => handleToggle(task.id, task.completed)}
                                />
                                <span className={`worker-task-text ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </span>
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WorkerPage