"use client";

import React, { ReactNode, ReactElement } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-96 p-6">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-rose-500/10 mb-4">
                <AlertTriangle className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Something went wrong
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                {this.state.error?.message ||
                  "An unexpected error occurred. Please try again."}
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all mx-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-96 p-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-rose-500/10 mb-4">
          <AlertTriangle className="h-8 w-8 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Error</h3>
        <p className="text-sm text-zinc-400 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all mx-auto"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
