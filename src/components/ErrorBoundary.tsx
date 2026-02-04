import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = "/"; // Hard reset to home
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex items-center justify-center bg-[#111217] p-4 font-sans">
                    <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto ring-1 ring-red-500/50">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
                            <p className="text-gray-400 text-sm">
                                {this.state.error?.message || "An unexpected error occurred."}
                            </p>
                        </div>

                        <div className="pt-2">
                            <Button
                                onClick={this.handleReset}
                                className="w-full bg-white text-black hover:bg-gray-200"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reload Application
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
