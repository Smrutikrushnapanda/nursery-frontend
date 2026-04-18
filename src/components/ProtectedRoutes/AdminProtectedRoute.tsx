import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/utils/store/store'

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter();
  const { organization, hasHydrated } = useAppStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if(hasHydrated) return
    if (!organization ) {
      router.replace("/signin");
    }else{
      setChecking(false)
    }
  })

  if (!hasHydrated && checking)
    return <div className='bg-background w-full h-screen'> Loading...</div>

  return (
    <>
      {children}
    </>
  )
}

export default AdminProtectedRoute
