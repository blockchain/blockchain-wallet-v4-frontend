import React from 'react'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

// TODO: this was copied from Swap, make generic and share between both
export const TopText = styled(Text)<{
  marginBottom?: boolean
  spaceBetween: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: ${props =>
    props.spaceBetween ? 'space-between' : 'initial'};
  margin-bottom: ${props => (props.marginBottom ? '16px' : '0px')};
`

export const Header = ({ handleClose }) => (
  <TopText spaceBetween marginBottom>
    <Icon name='arrow-bottom-right' color='blue600' size='24px' />
    <Icon
      name='close'
      color='grey600'
      role='button'
      data-e2e='close'
      size='24px'
      cursor
      onClick={handleClose}
    />
  </TopText>
)
