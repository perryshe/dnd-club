"use client"

import React from "react"

type Props = { children: React.ReactNode; fallback?: React.ReactNode }
type State = { hasError: boolean; error: Error | null }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack)
  }
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 bg-red-900/30 border border-red-500/50 rounded-xl">
            <h2 className="text-xl font-bold text-red-400 mb-2">Client-side Error</h2>
            <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono">
              {this.state.error?.message}
            </pre>
            <pre className="text-xs text-red-400/70 whitespace-pre-wrap font-mono mt-2">
              {this.state.error?.stack}
            </pre>
          </div>
        )
      )
    }
    return this.props.children
  }
}
