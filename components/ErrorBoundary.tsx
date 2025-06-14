"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo)
  }

  render() {
    const { hasError, error } = this.state
    const { fallback, children } = this.props

    if (hasError) {
      return fallback ?? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-red-950 text-center p-8">
          <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-300 mb-4" />
          <h2 className="text-2xl font-semibold text-red-700 dark:text-red-200">Something went wrong.</h2>
          <p className="mt-2 text-sm text-red-600 dark:text-red-300">An unexpected error has occurred. Please try refreshing the page.</p>
          {error && (
            <pre className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-xs overflow-auto rounded max-w-xl">
              {error.message}
            </pre>
          )}
        </div>
      )
    }

    return children
  }
}
