import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { getData } from './selectors'
import { Row } from '../Layout'
import { Button, HeartbeatLoader } from 'blockchain-info-components'

const ButtonRow = styled(Row)`
  padding: 0px 32px 23px 32px;
`
const BigButton = styled(Button)`
  height: 56px;
  border-radius: 6px;
  font-size: 17px;
  font-weight: 400;
  transition: box-shadow 0.3s;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.21);
  &:disabled {
    box-shadow: none;
  }
  &:active {
    box-shadow: none;
  }
`

class SubmitButton extends React.PureComponent {
  render () {
    const {
      blockLockbox,
      disabled,
      disabledPending,
      hide,
      txError,
      volume,
      asyncValidating,
      error,
      submitting,
      handleSubmit
    } = this.props

    if (hide) return null

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
