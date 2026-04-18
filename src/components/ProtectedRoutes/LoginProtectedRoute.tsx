'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/utils/store/store'

const LoginProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { organization, hasHydrated } = useAppStore()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!hasHydrated) return

    if (organization) {
      router.replace('/dashboard')
    } else {
      setChecking(false)
    }
  }, [organization, hasHydrated])

  // ⏳ Block EVERYTHING until decision is made
  if (!hasHydrated || checking) {
    return null // or loader
  }

  return <>{children}</>
}

export default LoginProtectedRoute