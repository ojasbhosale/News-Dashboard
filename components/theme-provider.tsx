"use client"

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { createContext, useContext, useEffect, useState } from "react"

// Extended theme configuration
interface ExtendedThemeConfig {
  enableSystemTheme: boolean
  enableTransitions: boolean
  storageKey: string
  themes: string[]
  defaultTheme: string
  disableTransitionOnChange: boolean
}

// Theme context for additional functionality
interface ThemeContextType {
  mounted: boolean
  config: ExtendedThemeConfig
  updateConfig: (newConfig: Partial<ExtendedThemeConfig>) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useThemeConfig() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useThemeConfig must be used within a ThemeProvider")
  }
  return context
}

interface EnhancedThemeProviderProps extends ThemeProviderProps {
  config?: Partial<ExtendedThemeConfig>
  enableColorSchemeSync?: boolean
  enablePreferenceSync?: boolean
}

export function ThemeProvider({ 
  children, 
  config: userConfig = {},
  enableColorSchemeSync = true,
  enablePreferenceSync = true,
  ...props 
}: EnhancedThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  
  // Default configuration
  const defaultConfig: ExtendedThemeConfig = {
    enableSystemTheme: true,
    enableTransitions: true,
    storageKey: "theme-preference",
    themes: ["light", "dark", "system"],
    defaultTheme: "system",
    disableTransitionOnChange: false,
    ...userConfig
  }

  const [config, setConfig] = useState<ExtendedThemeConfig>(defaultConfig)

  // Update configuration
  const updateConfig = (newConfig: Partial<ExtendedThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }

  // Handle mounting and hydration
  useEffect(() => {
    setMounted(true)
    
    // Disable transitions during theme changes for better performance
    if (config.disableTransitionOnChange) {
      const style = document.createElement('style')
      style.innerHTML = `
        *, *::before, *::after {
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
          animation-duration: 0.01ms !important;
          animation-delay: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `
      document.head.appendChild(style)
      
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [config.disableTransitionOnChange])

  // Sync with system color scheme preference
  useEffect(() => {
    if (!enableColorSchemeSync || !mounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Dispatch custom event for system theme changes
      window.dispatchEvent(new CustomEvent('system-theme-change', {
        detail: { isDark: e.matches }
      }))
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [enableColorSchemeSync, mounted])

  // Enhanced theme persistence
  useEffect(() => {
    if (!enablePreferenceSync || !mounted) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === config.storageKey && e.newValue) {
        // Theme was changed in another tab/window
        window.dispatchEvent(new CustomEvent('theme-sync', {
          detail: { theme: e.newValue }
        }))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [enablePreferenceSync, mounted, config.storageKey])

  // Provide enhanced theme configuration
  const contextValue: ThemeContextType = {
    mounted,
    config,
    updateConfig
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={config.defaultTheme}
        enableSystem={config.enableSystemTheme}
        enableColorScheme={false}
        storageKey={config.storageKey}
        themes={config.themes}
        disableTransitionOnChange={config.disableTransitionOnChange}
        {...props}
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}

// Enhanced theme hook with additional utilities
export function useEnhancedTheme() {
  const { theme, setTheme, resolvedTheme, themes } = useTheme()
  const { mounted, config } = useThemeConfig()
  
  const [isChanging, setIsChanging] = useState(false)

  const changeTheme = async (newTheme: string) => {
    if (!mounted || isChanging) return
    
    setIsChanging(true)
    
    // Add smooth transition effect
    if (config.enableTransitions) {
      document.documentElement.style.setProperty('--theme-transition', 'all 0.3s ease')
    }
    
    try {
      setTheme(newTheme)
      
      // Dispatch custom event for theme change
      window.dispatchEvent(new CustomEvent('theme-changed', {
        detail: { 
          from: theme, 
          to: newTheme,
          resolved: resolvedTheme 
        }
      }))
      
      // Small delay to ensure theme is applied
      await new Promise(resolve => setTimeout(resolve, 100))
    } finally {
      setIsChanging(false)
      
      if (config.enableTransitions) {
        document.documentElement.style.removeProperty('--theme-transition')
      }
    }
  }

  const getThemeIcon = (themeName: string) => {
    const icons = {
      light: 'sun',
      dark: 'moon',
      system: 'monitor',
      auto: 'monitor'
    }
    return icons[themeName as keyof typeof icons] || 'monitor'
  }

  const getThemeLabel = (themeName: string) => {
    const labels = {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      auto: 'Auto'
    }
    return labels[themeName as keyof typeof labels] || themeName
  }

  const isSystemTheme = theme === 'system'
  const isDarkMode = resolvedTheme === 'dark'
  const isLightMode = resolvedTheme === 'light'

  return {
    theme,
    setTheme: changeTheme,
    resolvedTheme,
    themes,
    mounted,
    isChanging,
    isSystemTheme,
    isDarkMode,
    isLightMode,
    getThemeIcon,
    getThemeLabel,
    config
  }
}

// Utility component for theme-aware animations
export function ThemeTransition({ 
  children, 
  className = "",
  duration = "300ms",
  easing = "ease"
}: {
  children: React.ReactNode
  className?: string
  duration?: string
  easing?: string
}) {
  const { config } = useThemeConfig()
  
  const transitionStyle = config.enableTransitions ? {
    transition: `all ${duration} ${easing}`,
  } : {}

  return (
    <div 
      className={className} 
      style={transitionStyle}
    >
      {children}
    </div>
  )
}

// Hook for detecting theme changes
export function useThemeChangeEffect(callback: (theme: string, resolvedTheme: string) => void) {
  const { theme, resolvedTheme } = useTheme()
  
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      callback(event.detail.to, event.detail.resolved)
    }
    
    window.addEventListener('theme-changed', handleThemeChange as EventListener)
    return () => window.removeEventListener('theme-changed', handleThemeChange as EventListener)
  }, [callback])
  
  useEffect(() => {
    if (theme && resolvedTheme) {
      callback(theme, resolvedTheme)
    }
  }, [theme, resolvedTheme, callback])
}

// Preload theme assets
export function preloadThemeAssets() {
  const themes = ['light', 'dark']
  
  themes.forEach(theme => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = `/themes/${theme}.css`
    document.head.appendChild(link)
  })
}

// Export the original useTheme hook from next-themes
export { useTheme } from "next-themes"