import { useState } from 'react'
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import {useNavigate} from "react-router-dom";

function AdminPage({ tasks }) {
    const [taskName, setTaskName] = useState('')
    const [taskType, setTaskType] = useState('daily')
    const navigate = useNavigate()

    const handleAddTask = async (e) => {
        e.preventDefault()

        if (!taskName.trim()) return

        const newTask = {
            title: taskName,
            type: taskType,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null,
        }

        try {
            await addDoc(collection(db, 'tasks'), newTask)
            setTaskName('')
            setTaskType('daily')
        } catch (error) {
            console.error('Error adding document:', error)
        }
    }

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteDoc(doc(db, 'tasks', taskId))
        } catch (error) {
            console.error('Error deleting task:', error)
        }
    }

    return (
        <div className="page-container">
            <h1 className="page-title" onClick={() => navigate('/worker')}>Admin Page</h1>
            <p className="page-subtitle">Add and manage household tasks</p>

            <form className="task-form" onSubmit={handleAddTask}>
                <div className="form-row">
                    <input
                        type="text"
                        placeholder="Enter task name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        className="task-input"
                    />

                    <select
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        className="task-select"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="one-time">Today</option>
                    </select>
                </div>

                <button type="submit" className="add-button">
                    Add Task
                </button>
            </form>

            <div className="tasks-section">
                <h2 className="section-title">Tasks</h2>

                {tasks.length === 0 ? (
                    <p className="empty-text">No tasks yet</p>
                ) : (
                    <div className="tasks-list">
                        {tasks.map((task) => (
                            <div key={task.id} className="task-card">
                                <div>
                                    <h3 className="task-title">{task.title}</h3>
                                    <p className="task-meta">Type: {task.type}</p>
                                    <p className="task-meta">
                                        Status: {task.completed ? 'Completed' : 'Pending'}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="delete-button"
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPage