import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Link } from "react-router-dom"
import { loginSchema } from "../schemas"
import type { LoginValues } from "../schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export function LoginForm() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    })

    async function onSubmit(data: LoginValues) {
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password)
            // navigate("/") - Handled by AuthLayout when user state updates
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Invalid email or password")
            setLoading(false) // Only stop loading on error. On success, let unmount/redirect happen.
        } finally {
            // Don't set loading false on success to prevent UI flash
            if (!auth.currentUser) setLoading(false)
        }
    }

    async function handleGoogleLogin() {
        setLoading(true)
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            // navigate("/") - Handled by AuthLayout
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Login failed. Check your credentials.")
            setLoading(false)
        } finally {
            if (!auth.currentUser) setLoading(false)
        }
    }

    return (
        <Card className="glass-panel w-full max-w-md border-white/10">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                <CardDescription className="text-gray-400">Sign in to your CRM account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="mr-2">G</span>}
                    Sign in with Google
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Separator className="flex-1 bg-white/10" />
                    <span>OR</span>
                    <Separator className="flex-1 bg-white/10" />
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            {...form.register("email")}
                            placeholder="name@example.com"
                            className="bg-secondary/50 border-white/10 text-white placeholder:text-gray-500"
                        />
                        {form.formState.errors.email && (
                            <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                {...form.register("password")}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="bg-secondary/50 border-white/10 text-white placeholder:text-gray-500 pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(108,93,211,0.5)]"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline hover:text-primary/80">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
