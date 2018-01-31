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
  border: 2px solid ${props => props.enabled ? props.theme['brand-primary'] : props.theme['gray-3']};
  border-radius: 74px;
`
const StyledIcon = styled(Icon)`
`

const SecurityIcon = (props) => (
  <Circle>
    <StyledIcon size='40px' color={props.enabled ? 'brand-primary' : 'gray-3'} name={props.name} />
  </Circle>
)

export default SecurityIcon
