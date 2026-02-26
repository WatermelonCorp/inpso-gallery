import { Link } from "react-router-dom";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="h-full bg-background text-foreground font-sans relative flex items-center justify-center overflow-hidden">
      {/* Decorative blurred orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-primary/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <Container className="w-full">
          <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center gap-6">
            <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-primary">404</h1>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Page not found</h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-sm mx-auto">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            <Link
              to="/"
              className={buttonVariants({ variant: "outline", className: "mt-4 px-6 h-11 flex items-center gap-2" })}
            >
              <MoveLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
