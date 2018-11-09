import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { getData } from './selectors'
import { Row } from '../Layout'
import { Button, HeartbeatLoader } from 'blockchain-info-components'

const ButtonRow = styled(Row)`
  border: 1px solid ${props => props.theme['gray-1']}};
  border-top: none;
`

class SubmitButton extends React.PureComponent {
  render () {
    const {
      blockLockbox,
      disabled,
      sourceCoin,
      targetCoin,
      txError,
      volume,
      asyncValidating,
      dirty,
      error,
      submitting
    } = this.props
    return (
      <ButtonRow>
        <Button
          type='submit'
          nature='primary'
          fullwidth
          disabled={
            disabled ||
            blockLockbox ||
            asyncValidating ||
            submitting ||
            !dirty ||
            volume === '0' ||
            !volume ||
            (volume && error) ||
            txError
          }
        >
          {!disabled && !asyncValidating && !submitting ? (
            <FormattedMessage
              id='scenes.exchange.exchangeform.exchange'
              defaultMessage='Exchange {source} for {target}'
              values={{
                source: sourceCoin,
                target: targetCoin
              }}
            />
          ) : (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          )}
        </Button>
      </ButtonRow>
    )
  }
}

export default connect(getData)(SubmitButton)
