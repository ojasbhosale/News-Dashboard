"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface OfflineContextType {
  isOnline: boolean
  lastSync: Date | null
  syncData: () => Promise<void>
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial state
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const syncData = async () => {
    if (isOnline) {
      setLastSync(new Date())
      // Sync logic would go here
    }
  }

  return <OfflineContext.Provider value={{ isOnline, lastSync, syncData }}>{children}</OfflineContext.Provider>
}

export function useOffline() {
  const context = useContext(OfflineContext)
  if (context === undefined) {
    throw new Error("useOffline must be used within an OfflineProvider")
  }
  return context
}
