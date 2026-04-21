'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/utils/store/store'
import { authApis } from '@/utils/api/api'

const LoginProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { hasHydrated } = useAppStore()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (!hasHydrated) return

    const verifyLoggedin = async () => {
      try {
        const response = await authApis.verify()
        setAuthorized(Boolean(response.data.authenticated))
      } catch {
        setAuthorized(false)
      } finally {
        setChecking(false)
      }
    }

    verifyLoggedin()
  }, [hasHydrated])

  useEffect(() => {
    if (!hasHydrated || checking) return

    if (authorized) {
      router.replace('/dashboard')
    }
  }, [authorized, checking, hasHydrated, router])

  if (!hasHydrated || checking) {
    return null
  }

  return <>{children}</>
}

export default LoginProtectedRoute
