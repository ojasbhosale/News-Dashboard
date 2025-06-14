"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Mail, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, loginWithOAuth } = useAuth()
  const { toast } = useToast()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(email, password)
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setLoading(true)
    const success = await loginWithOAuth(provider)
    if (success) {
      toast({
        title: "Welcome!",
        description: `Successfully logged in with ${provider}.`,
      })
    } else {
      toast({
        title: "Login failed",
        description: `Failed to login with ${provider}. Please try again.`,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            News Analytics Dashboard
          </CardTitle>
          <CardDescription>
            Sign in to access your comprehensive news analytics and payout management platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="oauth">OAuth</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="oauth" className="space-y-4">
              <Button
                onClick={() => handleOAuthLogin("google")}
                variant="outline"
                className="w-full transition-all duration-200 hover:bg-red-50 hover:border-red-200"
                disabled={loading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Continue with Google
              </Button>
              <Button
                onClick={() => handleOAuthLogin("github")}
                variant="outline"
                className="w-full transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
                disabled={loading}
              >
                <Github className="h-4 w-4 mr-2" />
                Continue with GitHub
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-sm text-blue-900 mb-2">Demo Accounts</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                <strong>Admin:</strong> admin@example.com (any password)
              </p>
              <p>
                <strong>User:</strong> user@example.com (any password)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
