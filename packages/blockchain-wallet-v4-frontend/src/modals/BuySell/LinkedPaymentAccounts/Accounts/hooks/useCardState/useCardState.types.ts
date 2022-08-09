import { ReactNode } from 'react'

export type CardStateHook = () => {
  addCard: (card: ReactNode) => void
  card: ReactNode | undefined
  clearCard: () => void
}
