import { Redirect, router } from 'expo-router'

import { useEffect } from 'react'
import { supabase } from '@/supabase'

const Index = (): JSX.Element => {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session): void => {
      if ((session?.user) != null) {
        router.replace('/memo/list')
      }
    })
  }, [])
  return <Redirect href='auth/log_in' />
}

export default Index
