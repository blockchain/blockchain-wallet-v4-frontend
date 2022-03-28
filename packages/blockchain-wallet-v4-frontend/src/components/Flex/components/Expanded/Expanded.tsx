import React from 'react'

import { ExpandedComponent } from './types'

export const Expanded: ExpandedComponent = ({ children, grow }) => {
  return <div style={{ flexGrow: grow ?? 1 }}>{children}</div>
}
