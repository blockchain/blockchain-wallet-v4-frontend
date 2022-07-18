import React from 'react'

import { ExpandedComponent } from './types'

export const Expanded: ExpandedComponent = ({ children, grow, style = {} }) => {
  return <div style={{ flexGrow: grow ?? 1, ...style }}>{children}</div>
}
