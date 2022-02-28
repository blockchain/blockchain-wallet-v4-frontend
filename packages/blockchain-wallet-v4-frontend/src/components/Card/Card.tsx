import React from 'react'

import { CardComponent } from './types'

export const Card: CardComponent = ({ children }) => {
  return <div style={{ border: '1px solid #DFE3EB', borderRadius: 12 }}>{children}</div>
}
