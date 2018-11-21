import React from 'react'
import styled from 'styled-components'

import ReactTooltip from 'react-tooltip'

const StyledTip = styled(ReactTooltip)`
  cursor: pointer;
  font-weight: 300;
  text-align: left;
  padding: 7px 12px;
  text-transform: none;
  z-index: 2000 !important;
  font-size: 11px !important;
  pointer-events: auto !important;
  font-family: 'Montserrat', sans serif;
  max-width: ${props => props.maxWidth || '200px'};
`

const Tooltip = props => {
  const { id, children, ...rest } = props

  return (
    <StyledTip id={id} delayHide={250} effect='solid' {...rest}>
      {children}
    </StyledTip>
  )
}

export default Tooltip
