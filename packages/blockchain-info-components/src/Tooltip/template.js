import React from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

const StyledTip = styled(ReactTooltip)`
  cursor: pointer;
  font-weight: 400;
  text-align: left;
  padding: ${({ padding }) => padding || '7px 12px'};
  text-transform: none;
  z-index: 2000 !important;
  font-size: 11px !important;
  pointer-events: auto !important;
  background-color: ${({ bgColor }) => bgColor + ' !important'};
  opacity: ${({ opacity }) => opacity + ' !important'};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: ${props => props.maxWidth || '200px'};
  max-height: ${props => props.maxHeight || ''};
`

const Tooltip = props => {
  const { bgColor, children, id, opacity, padding, ...rest } = props

  return (
    <StyledTip
      id={id}
      delayHide={250}
      bgColor={bgColor}
      opacity={opacity}
      padding={padding}
      effect='solid'
      {...rest}
    >
      {children}
    </StyledTip>
  )
}

export default Tooltip
