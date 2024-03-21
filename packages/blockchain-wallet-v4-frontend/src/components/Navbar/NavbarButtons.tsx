import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { IconRefresh, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button } from 'blockchain-info-components'
import { refreshClicked } from 'data/components/refresh/actions'

export const StyledButton = styled(Button)`
  padding: 0 12px;
  min-width: 32px;
  border-radius: 4px;
`

export const NavButton = styled(Button)`
  display: flex;
  align-items: center;
  position: relative;
  transition: color 0.3s;
  background: transparent;
  min-width: auto;
  width: auto;
  padding: 0;
  border: 0;

  &:hover {
    background-color: transparent;
  }
`
export const SendButton = ({ onClick }) => (
  <StyledButton data-e2e='sendButton' nature='empty-blue' onClick={onClick} small>
    <FormattedMessage id='buttons.send' defaultMessage='Send' />
  </StyledButton>
)

export const ReceiveButton = ({ onClick }) => (
  <StyledButton data-e2e='receiveButton' nature='empty-blue' onClick={onClick} small>
    <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
  </StyledButton>
)

export const RefreshButton = () => {
  const dispatch = useDispatch()
  const onClick = () => {
    dispatch(refreshClicked())
  }
  return (
    <NavButton onClick={onClick} data-e2e='refreshLink'>
      <IconRefresh color={PaletteColors['grey-400']} size='small' />
    </NavButton>
  )
}
