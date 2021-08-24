import React from 'react'
import { DefaultTheme } from 'styled-components'

import { Text, Tooltip, TooltipHost } from 'blockchain-info-components'

const CollapseText: React.FC<Props> = ({ place, text, ...rest }) => {
  const collapsed = `${text.slice(0, 4)}...${text.slice(-4)}`

  return (
    <TooltipHost id='collapsed-text'>
      <Text {...rest} style={{ display: 'inline-flex' }}>
        {collapsed}
      </Text>
      <Tooltip maxWidth='auto' id='collapsed-text' place={place || 'right'}>
        {text}
      </Tooltip>
    </TooltipHost>
  )
}

type Props = {
  color: keyof DefaultTheme
  place: 'top' | 'right' | 'bottom' | 'left'
  size: string
  text: string
  weight: number
}

export default CollapseText
