import { ReactNode, useCallback, useState } from 'react'

import { CardStateHook } from './useCardState.types'

export const useCardState: CardStateHook = () => {
  const [card, setCard] = useState<ReactNode | undefined>()

  const clearCard = useCallback(() => setCard(undefined), [setCard])

  const addCard = useCallback((card: ReactNode) => setCard(card), [setCard])

  return {
    addCard,
    card,
    clearCard
  }
}
