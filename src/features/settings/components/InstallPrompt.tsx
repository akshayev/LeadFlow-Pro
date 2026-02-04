import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handler);

        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true);
        }

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            toast.success("Installing app...");
        }
    };

    if (!deferredPrompt || isInstalled) return null;

    return (
        <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary text-gray-400 group"
            onClick={handleInstall}
        >
            <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
            Install App
        </Button>
    );
}
