import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Link } from "react-router-dom"
import { registerSchema } from "../schemas"
import type { RegisterValues } from "../schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function RegisterForm() {
    const [loading, setLoading] = useState(false)

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "" },
    })

    async function onSubmit(data: RegisterValues) {
        setLoading(true)
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
            await updateProfile(userCredential.user, { displayName: data.name })
            // navigate("/") - Handled by AuthLayout
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Registration failed")
            setLoading(false)
        } finally {
            if (!auth.currentUser) setLoading(false)
        }
    }

    return (
        <Card className="glass-panel w-full max-w-md border-white/10">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
                <CardDescription className="text-gray-400">Join LeadFlow Pro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            {...form.register("name")}
                            placeholder="Full Name"
                            className="bg-secondary/50 border-white/10 text-white placeholder:text-gray-500"
                        />
                        {form.formState.errors.name && (
                            <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>
                        )}
                    </div>
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
                        <Input
                            {...form.register("password")}
                            type="password"
                            placeholder="Password"
                            className="bg-secondary/50 border-white/10 text-white placeholder:text-gray-500"
                        />
                        {form.formState.errors.password && (
                            <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(108,93,211,0.5)]"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                    </Button>
                </form>
                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline hover:text-primary/80">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
