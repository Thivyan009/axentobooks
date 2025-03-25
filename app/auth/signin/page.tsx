"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return "Email is required"
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required"
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters"
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    
    setErrors({
      email: emailError,
      password: passwordError,
    })

    if (emailError || passwordError) {
      return
    }

    setIsLoading(true)

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!result) {
        throw new Error("Sign in failed - no result returned")
      }

      if (result.error) {
        if (result.error === "CredentialsSignin") {
          toast({
            title: "Invalid credentials",
            description: "The email or password you entered is incorrect",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        }
        return
      }

      toast({
        title: "Success",
        description: "Signed in successfully",
      })

      // Always redirect to dashboard for returning users
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred during sign in",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Only show sign in form if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrors(prev => ({ ...prev, email: "" }))
                }}
                required
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors(prev => ({ ...prev, password: "" }))
                  }}
                  required
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
} 