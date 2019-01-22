import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'

import { getData } from './selectors'
import { Row } from '../Layout'
import { Icon, Button, HeartbeatLoader } from 'blockchain-info-components'

const ButtonRow = styled(Row)`
  padding: 0px 32px 23px 32px;
`
const BigButton = styled(Button)`
  width: 100%;
  color: ${props => props.theme.white};
  height: 56px;
  font-size: 17px;
  font-weight: 400;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.21);
  &:disabled {
    box-shadow: none;
  }
  &:active {
    box-shadow: none;
  }
`

const BigDemoButton = styled(BigButton)`
  background-color: rgba(0, 0, 0, 0);
  justify-content: space-between;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

const ButtonContainer = styled.div`
  border-radius: 6px;
  width: 100%;
  background-image: url('/img/exchange-demo-button-bg.png');
  background-size: 100% 100%;
`

const RightArrowIcon = styled(Icon)`
  transform: rotate(270deg);
`

const DemoButton = () => (
  <ButtonRow>
    <LinkContainer to='/swap/profile'>
      <ButtonContainer>
        <BigDemoButton>
          <Icon name='lock' color='white' weight='600' size='32px' />
          <FormattedMessage
            id='scenes.exchange.exchangeform.unlock_swap_now'
            defaultMessage='Unlock Swap Now'
          />
          <RightArrowIcon
            name='down-arrow-filled'
            color='white'
            size='18px'
            weight='600'
          />
        </BigDemoButton>
      </ButtonContainer>
    </LinkContainer>
  </ButtonRow>
)

class SubmitButton extends React.PureComponent {
  render () {
    const {
      blockLockbox,
      disabled,
      disabledPending,
      hide,
      isDemo,
      txError,
      volume,
      asyncValidating,
      error,
      submitting,
      handleSubmit
    } = this.props

    if (hide) return null

    if (isDemo) return <DemoButton />

    return (
      <ButtonRow>
        <BigButton
          nature='primary'
          fullwidth
          onClick={handleSubmit}
          disabled={
            disabledPending ||
            disabled ||
            blockLockbox ||
            asyncValidating ||
            submitting ||
            volume === '0' ||
            !volume ||
            (volume && error) ||
            txError
          }
        >
          {!disabled && !asyncValidating && !submitting ? (
            <FormattedMessage
              id='scenes.exchange.exchangeform.swap'
              defaultMessage='Swap'
            />
          ) : (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          )}
        </BigButton>
      </ButtonRow>
    )
  }
}

export default connect(getData)(SubmitButton)
