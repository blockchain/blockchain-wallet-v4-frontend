import React from 'react'
import styled from 'styled-components'

import ReactTooltip from 'react-tooltip'

const StyledTip = styled(ReactTooltip)`
  color: ${props => props.theme['gray-5']} !important;
  border: 1px solid ${props => props.theme['gray-2']} !important;
  background-color: ${props => props.theme['white-blue']} !important;
  cursor: pointer;
  max-width: 350px;
  font-size: 11px;
  font-weight: 300;
  z-index: 2000;
  font-family: 'Montserrat', sans serif;
  pointer-events: auto !important;
  &:hover {
    visibility: visible !important;
    opacity: 1 !important;
  }

  &.place-top {
    &:before {
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      bottom: -7px;
      left: 50%;
      margin-left: -9px;
      border-top: 7px solid ${props => props.theme['gray-2']} !important;
    }

    &:after {
      border-top-color: ${props => props.theme['white-blue']} !important;
    }
  }

  &.place-left {
    &:before {
      border-left-color: ${props => props.theme['gray-2']} !important;
    }

    &:after {
      border-left-color: ${props => props.theme['white-blue']} !important;
    }
  }

  &.place-bottom {
    &:before {
      border-bottom-color: ${props => props.theme['gray-2']} !important;
    }

    &:after {
      border-bottom-color: ${props => props.theme['white-blue']} !important;
    }
  }

  &.place-right {
    &:before {
      border-right-color: ${props => props.theme['gray-2']} !important;
    }

    &:after {
      border-right-color: ${props => props.theme['white-blue']} !important;
    }
  }
`

const Tooltip = props => {
  const { id, children, ...rest } = props

  return (
    <StyledTip
      id={id}
      delayHide={250}
      effect='solid'
      type='light'
      border='true'
      {...rest}
    >
      {children}
    </StyledTip>
  )
}

export default Tooltip
