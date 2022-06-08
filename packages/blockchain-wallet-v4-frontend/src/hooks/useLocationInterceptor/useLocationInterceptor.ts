import { useEffect } from 'react'

import { LocationInterceptorHook } from './useLocationInterceptor.types'

const useLocationInterceptor: LocationInterceptorHook = ({ history }) => {
  useEffect(() => {
    return history.listen(() => {})
  }, [history])
}

export { useLocationInterceptor }
