import { useEffect } from 'react'

import { UseEffectOnceHook } from './types'

export const useEffectOnce: UseEffectOnceHook = (effect) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
