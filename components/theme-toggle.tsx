"use client"

import { Moon, Sun, Monitor, Palette, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { useEnhancedTheme, useThemeConfig, ThemeTransition } from "./theme-provider"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface ThemeToggleProps {
  variant?: "default" | "simple" | "compact" | "icon-only"
  showSystemOption?: boolean
  showSettings?: boolean
  size?: "default" | "sm" | "lg" | "icon" // Fixed: Updated to match Button component's accepted sizes
  className?: string
}

export function ThemeToggle({ 
  variant = "default",
  showSystemOption = true,
  showSettings = false,
  size = "sm",
  className 
}: ThemeToggleProps) {
  const { 
    theme, 
    setTheme, 
    themes, 
    mounted, 
    isChanging,
    isDarkMode,
    getThemeIcon,
    getThemeLabel 
  } = useEnhancedTheme()
  
  const { config, updateConfig } = useThemeConfig()

  // Loading state
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size={size} 
        className={cn(
          "relative overflow-hidden",
          variant === "icon-only" ? "h-9 w-9" : "",
          className
        )}
        disabled
      >
        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  // Simple toggle variant (light/dark only)
  if (variant === "simple") {
    return (
      <Button 
        variant="ghost" 
        size={size}
        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
        className={cn(
          "relative overflow-hidden group h-9 w-9 rounded-full transition-all duration-300",
          "hover:bg-accent/50 hover:scale-110",
          isChanging && "animate-pulse",
          className
        )}
        disabled={isChanging}
      >
        <ThemeTransition>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 group-hover:text-yellow-500" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 group-hover:text-blue-400" />
        </ThemeTransition>
        <span className="sr-only">Toggle theme</span>
        
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full scale-0 group-hover:scale-100" />
      </Button>
    )
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={() => {
          const currentIndex = themes.indexOf(theme || "system")
          const nextIndex = (currentIndex + 1) % themes.length
          setTheme(themes[nextIndex])
        }}
        className={cn(
          "relative overflow-hidden group transition-all duration-300",
          "hover:bg-accent/50",
          isChanging && "animate-pulse",
          className
        )}
        disabled={isChanging}
      >
        <ThemeTransition className="flex items-center gap-2">
          {theme === "light" && <Sun className="h-4 w-4" />}
          {theme === "dark" && <Moon className="h-4 w-4" />}
          {theme === "system" && <Monitor className="h-4 w-4" />}
          <span className="text-sm font-medium">{getThemeLabel(theme || "system")}</span>
        </ThemeTransition>
      </Button>
    )
  }

  // Icon-only variant
  if (variant === "icon-only") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size={size}
            className={cn(
              "relative overflow-hidden group hover:bg-accent/50 transition-all duration-300 h-9 w-9 rounded-full",
              isChanging && "animate-pulse",
              className
            )}
            disabled={isChanging}
          >
            <ThemeTransition>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 group-hover:text-yellow-500" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 group-hover:text-blue-400" />
            </ThemeTransition>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {themes.filter((themeOption, themeIndex, arr) => arr.indexOf(themeOption) === themeIndex).map((themeOption, themeIndex) => (
            <DropdownMenuItem
              key={`theme-${themeOption}-${themeIndex}`} // Fixed: Use themeIndex instead of undefined index
              onClick={() => setTheme(themeOption)}
              className={cn(
                "flex items-center gap-2 cursor-pointer transition-all duration-200",
                theme === themeOption 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "hover:bg-accent/50"
              )}
            >
              {getThemeIcon(themeOption) === "sun" && <Sun className="h-4 w-4" />}
              {getThemeIcon(themeOption) === "moon" && <Moon className="h-4 w-4" />}
              {getThemeIcon(themeOption) === "monitor" && <Monitor className="h-4 w-4" />}
              <span>{getThemeLabel(themeOption)}</span>
              {theme === themeOption && (
                <div className="ml-auto h-2 w-2 bg-primary rounded-full animate-pulse" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Default variant with full dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={size} 
          className={cn(
            "relative overflow-hidden group hover:bg-accent/50 transition-all duration-300",
            isChanging && "animate-pulse",
            className
          )}
          disabled={isChanging}
        >
          <ThemeTransition>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 group-hover:text-yellow-500" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 group-hover:text-blue-400" />
          </ThemeTransition>
          <span className="sr-only">Toggle theme</span>
          
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "glass-morphism border-border/50 min-w-[180px]",
          showSettings && "min-w-[220px]"
        )}
      >
        <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
          <Palette className="h-3 w-3" />
          Theme Selection
        </DropdownMenuLabel>
        
        {themes
          .filter((themeOption, themeIndex, arr) => arr.indexOf(themeOption) === themeIndex)
          .map((themeOption, themeIndex) => { // Fixed: Use themeIndex instead of undefined index
            if (!showSystemOption && themeOption === "system") return null
            
            return (
              <DropdownMenuItem
                key={`theme-option-${themeOption}-${themeIndex}`} // Fixed: Use themeIndex instead of undefined index
                onClick={() => setTheme(themeOption)}
                className={cn(
                  "flex items-center gap-2 cursor-pointer transition-all duration-200",
                  theme === themeOption 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-accent/50"
                )}
              >
                {getThemeIcon(themeOption) === "sun" && <Sun className="h-4 w-4" />}
                {getThemeIcon(themeOption) === "moon" && <Moon className="h-4 w-4" />}
                {getThemeIcon(themeOption) === "monitor" && <Monitor className="h-4 w-4" />}
                <span>{getThemeLabel(themeOption)}</span>
                {theme === themeOption && (
                  <div className="ml-auto h-2 w-2 bg-primary rounded-full animate-pulse" />
                )}
              </DropdownMenuItem>
            )
          })}
        
        {showSettings && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
              <Settings className="h-3 w-3" />
              Theme Settings
            </DropdownMenuLabel>
            
            <DropdownMenuCheckboxItem
              checked={config.enableTransitions}
              onCheckedChange={(checked) => 
                updateConfig({ enableTransitions: checked })
              }
            >
              Smooth Transitions
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={config.enableSystemTheme}
              onCheckedChange={(checked) => 
                updateConfig({ enableSystemTheme: checked })
              }
            >
              System Theme Sync
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Keyboard shortcut component
export function ThemeKeyboardShortcut() {
  const { setTheme, isDarkMode } = useEnhancedTheme()
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + T to toggle theme
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault()
        setTheme(isDarkMode ? "light" : "dark")
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setTheme, isDarkMode])
  
  return null
}

// Theme status indicator
export function ThemeStatus() {
  const { theme, resolvedTheme, mounted } = useEnhancedTheme()
  
  if (!mounted) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50 opacity-20 hover:opacity-100 transition-opacity">
      <div className="glass-morphism px-2 py-1 rounded-md text-xs">
        <span className="font-mono">
          {theme} {resolvedTheme && `(${resolvedTheme})`}
        </span>
      </div>
    </div>
  )
}