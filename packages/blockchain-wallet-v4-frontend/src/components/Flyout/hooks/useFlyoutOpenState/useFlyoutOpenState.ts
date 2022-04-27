import { useCallback, useState } from 'react'

import { duration as defaultDuration } from '../..'
import { FlyoutOpenStateHook } from './useFlyoutOpenState.types'

export const useFlyoutOpenState: FlyoutOpenStateHook = ({
  duration = defaultDuration,
  initialValue = false,
  onClose = () => null
} = {}) => {
  const [isOpen, setOpen] = useState<boolean>(initialValue)

  const onPressClose = useCallback(() => {
    setOpen(false)

    setTimeout(onClose, duration)
  }, [duration, setOpen, onClose])

  return {
    isOpen,
    onPressClose
  }
}
