// App.tsx
// Root component with routing and providers

import * as React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'

// Layout
import { AppLayout } from '@/components/layout/AppLayout'

// Common
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// Pages
import Welcome from '@/pages/Welcome'
import Install from '@/pages/Install'
import ModelsConfig from '@/pages/ModelsConfig'
import ChannelsConfig from '@/pages/ChannelsConfig'
import Dashboard from '@/pages/Dashboard'

// Store
import { useAppStore } from '@/stores/appStore'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// Route guard component
const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isInstalled = useAppStore((state) => state.isInstalled)
  const location = useLocation()

  // Pages that don't require installation check
  const publicPaths = ['/', '/install']
  const isPublicPath = publicPaths.includes(location.pathname)

  // If not installed and trying to access protected page, redirect to welcome
  if (!isInstalled && !isPublicPath) {
    return <Navigate to="/" replace />
  }

  // If installed and on welcome page, redirect to dashboard
  if (isInstalled && location.pathname === '/') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

// Page transition wrapper
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

// Animated routes
const AnimatedRoutes: React.FC = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes (no sidebar) */}
        <Route
          path="/"
          element={
            <PageTransition>
              <Welcome />
            </PageTransition>
          }
        />
        <Route
          path="/install"
          element={
            <PageTransition>
              <Install />
            </PageTransition>
          }
        />

        {/* Protected routes (with sidebar) */}
        <Route
          element={
            <AppLayout>
              <RouteGuard>
                <Outlet />
              </RouteGuard>
            </AppLayout>
          }
        >
          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="/models"
            element={
              <PageTransition>
                <ModelsConfig />
              </PageTransition>
            }
          />
          <Route
            path="/channels"
            element={
              <PageTransition>
                <ChannelsConfig />
              </PageTransition>
            }
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RouteGuard>
            <AnimatedRoutes />
          </RouteGuard>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
