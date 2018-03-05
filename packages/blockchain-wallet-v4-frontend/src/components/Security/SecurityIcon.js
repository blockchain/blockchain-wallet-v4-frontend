import React from 'react'
import styled from 'styled-components'
import { Icon } from 'blockchain-info-components'

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  align-items: center;
  width: 74px;
  height: 74px;
  border: 2px solid ${props => props.enabled ? props.theme['success'] : props.theme['gray-2']};
  border-radius: 74px;
`
const StyledIcon = styled(Icon)`
  display: flex;
`

const SecurityIcon = (props) => (
  <Circle enabled={props.enabled}>
    <StyledIcon size='40px' color={props.enabled ? 'success' : 'gray-2'} name={props.name} />
  </Circle>
)

export default SecurityIcon
