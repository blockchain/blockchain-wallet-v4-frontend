import { useEffect, useRef, useState } from 'react'

export const useTokensListScroll = ({
  isActive,
  onScrollEnd
}: {
  isActive: boolean
  onScrollEnd: () => void
}) => {
  const scrollableListRef = useRef<HTMLDivElement>(null)
  const [isEndReached, setIsEndReached] = useState(false)

  const onListScroll = (offset = 0) => {
    const listElement = scrollableListRef.current
    if (!listElement) return
    if (listElement.offsetHeight + listElement.scrollTop + offset >= listElement.scrollHeight) {
      setIsEndReached(true)
    }
  }

  // TODO: Try to remove that isActive prop and just watch for scroll container height to reset isEndReached
  useEffect(() => {
    if (isActive === false) {
      setIsEndReached(false)
    }
  }, [isActive])

  useEffect(() => {
    if (isEndReached) {
      onScrollEnd()
    }
  }, [isEndReached, onScrollEnd])

  return {
    onScroll: onListScroll,
    ref: scrollableListRef
  }
}
