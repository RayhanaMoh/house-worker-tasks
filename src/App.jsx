import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import AdminPage from './pages/AdminPage'
import WorkerPage from './pages/WorkerPage'
import { db } from './firebase'

function App() {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'tasks'),
            (snapshot) => {
                const tasksData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))

                    .sort((a ,b) => {
                    // Sort by completion status first, then by creation date
                    if (a.completed !== b.completed) {
                        return a.completed - b.completed
                    }

                    // If both tasks have the same completion status, sort by creation date
                    const order={
                        'one-time': 0,
                        'daily': 1,
                        'weekly': 2,
                        'monthly': 3
                    }
                    // Sort by type if types are different
                        if(order[a.type] !== order[b.type]){
                            return order[a.type] - order[b.type]
                        }

                        // If both tasks have the same type, sort by creation date
                    return new Date(a.createdAt) - new Date(b.createdAt)
                })
                setTasks(tasksData)
            },
            (error) => {
                console.error('Firestore error:', error)
            }
        )

        return () => unsubscribe()
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/worker" replace />} />
                <Route path="/admin" element={<AdminPage tasks={tasks} setTasks={setTasks} />} />
                <Route path="/worker" element={<WorkerPage tasks={tasks} setTasks={setTasks} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App