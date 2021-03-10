import React from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import { media } from 'services/styles'

const Circle = styled.div`
  display: none;
  justify-content: center;
  align-self: center;
  align-items: center;
  width: 74px;
  height: 74px;
  background: ${props => props.theme.white};
  border: 2px solid ${props => props.theme.grey200};
  border-radius: 74px;
  &.active {
    background: ${props => props.theme.grey000};
  }
  ${media.atLeastMobile`
    display: flex;
  `}
`
const StyledIcon = styled(Icon)`
  display: flex;
`

const SecurityIcon = props => (
  <Circle className={props.enabled ? 'active' : ''}>
    <StyledIcon
      size='40px'
      color={props.enabled ? 'success' : 'grey200'}
      name={props.enabled ? 'checkmark-in-circle-filled' : props.name}
    />
  </Circle>
)

export default SecurityIcon
