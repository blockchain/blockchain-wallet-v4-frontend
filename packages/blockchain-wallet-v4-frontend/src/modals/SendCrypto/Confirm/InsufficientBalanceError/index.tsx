import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

const InsufficientBalanceError: React.FC<Props> = ({ handleMax, tryAgain }) => {
  return (
    <FlyoutWrapper style={{ textAlign: 'center' }}>
      <Text color='red600' size='16px' weight={600}>
        <FormattedMessage id='copy.insufficient_balance' defaultMessage='Insufficient Balance' />
      </Text>
      <Text
        style={{ marginTop: '8px', padding: '0 24px', textAlign: 'center' }}
        size='14px'
        weight={500}
      >
        <FormattedMessage
          id='copy.balance_err'
          defaultMessage='You do not own enough funds to send that amount with the selected fee.'
        />
      </Text>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginTop: '24px'
        }}
      >
        <Button
          onClick={handleMax}
          style={{ margin: '0 auto' }}
          data-e2e='sendMax'
          nature='primary'
        >
          Send Max
        </Button>
        <Text style={{ marginTop: '8px' }} size='12px' weight={500}>
          <FormattedMessage defaultMessage='or' id='copy.or' />
        </Text>
        <Text
          onClick={() => tryAgain()}
          cursor='pointer'
          size='12px'
          weight={500}
          color='blue600'
          style={{ marginTop: '4px' }}
        >
          <FormattedMessage id='copy.try_again' defaultMessage='Try Again' />
        </Text>
      </div>
    </FlyoutWrapper>
  )
}

type Props = {
  handleMax: () => void
  tryAgain: () => void
}

export default InsufficientBalanceError
