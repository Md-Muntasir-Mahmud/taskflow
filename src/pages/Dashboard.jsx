import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, Moon, Sun, Plus, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Dashboard() {
  const navigate = useNavigate()

  // ---------- useState ----------
  const [user, setUser] = useState(localStorage.getItem("taskflow-user") || "")
  const [text, setText] = useState("")
  const [filter, setFilter] = useState("all") // all | active | done
  const [dark, setDark] = useState(localStorage.getItem("taskflow-dark") === "true")
  // Lazy initial value: read saved tasks from localStorage only once
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("taskflow-tasks")
    return saved ? JSON.parse(saved) : []
  })

  // ---------- useEffect ----------
  // 1) Protect the page: if nobody is logged in, send them to the login page
  useEffect(() => {
    if (!user) navigate("/")
  }, [user, navigate])

  // 2) Save tasks every time the `tasks` array changes
  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks))
  }, [tasks])

  // 3) Update the browser tab title with the number of remaining tasks
  useEffect(() => {
    const remaining = tasks.filter((t) => !t.done).length
    document.title = `(${remaining}) TaskFlow`
  }, [tasks])

  // 4) Apply dark mode by toggling a class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("taskflow-dark", String(dark))
  }, [dark])

  // ---------- handlers ----------
  const addTask = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setTasks([...tasks, { id: Date.now(), title: text.trim(), done: false }])
    setText("")
  }

  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id))

  const clearCompleted = () => setTasks(tasks.filter((t) => !t.done))

  const logout = () => {
    localStorage.removeItem("taskflow-user")
    setUser("")
    navigate("/") // useNavigate: back to login
  }

  // ---------- derived data ----------
  const visibleTasks = tasks.filter((t) => {
    if (filter === "active") return !t.done
    if (filter === "done") return t.done
    return true
  })
  const doneCount = tasks.filter((t) => t.done).length

  return (
    <div className="min-h-screen p-4 flex justify-center">
      <div className="w-full max-w-xl flex flex-col gap-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hello, {user} 👋</h1>
            <p className="text-sm text-muted-foreground">
              {tasks.length - doneCount} remaining · {doneCount} completed
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setDark(!dark)}>
              {dark ? <Sun /> : <Moon />}
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut /> Logout
            </Button>
          </div>
        </div>

        {/* Add task */}
        <Card>
          <CardHeader>
            <CardTitle>Add a task</CardTitle>
            <CardDescription>What do you want to get done?</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addTask} className="flex gap-2">
              <Input
                placeholder="e.g. Finish React assignment"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button type="submit">
                <Plus /> Add
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Task list */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your tasks</CardTitle>
              <Badge variant="secondary">{tasks.length} total</Badge>
            </div>
            <div className="flex gap-2 pt-2">
              {["all", "active", "done"].map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? "default" : "outline"}
                  onClick={() => setFilter(f)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {visibleTasks.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-6">
                No tasks here yet.
              </p>
            )}
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Button
                  size="icon"
                  variant={task.done ? "default" : "outline"}
                  className="size-7 rounded-full"
                  onClick={() => toggleTask(task.id)}
                >
                  {task.done && <Check />}
                </Button>
                <span
                  className={`flex-1 text-sm ${
                    task.done ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
            ))}
            {doneCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCompleted} className="mt-2">
                Clear completed ({doneCount})
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
