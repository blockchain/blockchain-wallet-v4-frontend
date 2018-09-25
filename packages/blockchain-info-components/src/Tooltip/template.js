import React from 'react'
import styled from 'styled-components'

import ReactTooltip from 'react-tooltip'

const StyledTip = styled(ReactTooltip)`
  cursor: pointer;
  max-width: 200px;
  font-size: 11px;
  font-weight: 300;
  z-index: 2000;
  text-align: left;
  padding: 7px 12px;
  text-transform: none;
  pointer-events: auto !important;
  font-family: 'Montserrat', sans serif;
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
