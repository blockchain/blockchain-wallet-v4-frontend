import React from 'react'
import styled from 'styled-components'

import ReactTooltip from 'react-tooltip'

const StyledTip = styled(ReactTooltip)`
  cursor: pointer;
  font-weight: 400;
  text-align: left;
  padding: ${({ toolTipPad }) => (toolTipPad || '7px 12px')};
  text-transform: none;
  z-index: 2000 !important;
  font-size: 11px !important;
  pointer-events: auto !important;
  background-color: ${({ bgColor }) => bgColor + ' !important'};
  opacity: ${({ toolTipOpacity }) => toolTipOpacity + ' !important'};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: ${props => props.maxWidth || '200px'};
`

const Tooltip = props => {
  const { id, children, bgColor, toolTipOpacity, toolTipPad, ...rest } = props

  return (
    <StyledTip
      id={id}
      delayHide={250}
      bgColor={bgColor}
      toolTipOpacity={toolTipOpacity}
      toolTipPad={toolTipPad}
      effect='solid'
      {...rest}
    >
      {children}
    </StyledTip>
  )
}

export default Tooltip
