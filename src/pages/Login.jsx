import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Login() {
  // useState: holds what the user is typing, plus an error message
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  // useNavigate: lets us change the page from code
  const navigate = useNavigate()

  // useEffect: runs once when the page loads.
  // If the user is already "logged in", skip this page.
  useEffect(() => {
    const savedUser = localStorage.getItem("taskflow-user")
    if (savedUser) {
      navigate("/dashboard")
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError("Please enter at least 2 characters.")
      return
    }
    localStorage.setItem("taskflow-user", name.trim())
    navigate("/dashboard") // go to the dashboard page
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <CardHeader className="items-center text-center">
            <div className="rounded-full bg-primary text-primary-foreground p-3 mb-2">
              <ListChecks className="size-6" />
            </div>
            <CardTitle className="text-2xl">Welcome to TaskFlow</CardTitle>
            <CardDescription>Enter your name to get started</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError("")
              }}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
