import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/utils/store/store'
import { authApis } from '@/utils/api/api'
import GlobalLoader from '../GlobalLoader'

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { hasHydrated, setLoggedIn } = useAppStore()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (!hasHydrated) return

    const verifyLoggedin = async () => {
      try {
        const response = await authApis.verify()
        setLoggedIn(response.data.authenticated);
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

    if (!authorized) {
      router.replace('/signin')
    }
  }, [authorized, checking, hasHydrated, router])

  if (!hasHydrated || checking) {
    return <div className='bg-background w-full h-screen'> <GlobalLoader /> </div>
  }

  return <>{children}</>
}

export default AdminProtectedRoute
