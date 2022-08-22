import React from 'react'

import { Button, Image } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import {
  ActionsList,
  ErrorContent,
  ErrorIconWithSeverity,
  GenericErrorLayout
} from 'components/GenericError'
import usePaymentErrorReason from 'components/Hooks/usePaymentErrorReason'
import { Padding } from 'components/Padding'
import { PlaidSettlementErrorReasons } from 'data/types'

const PaymentAccountError = ({ buttonHandler, reason }) => {
  const [title, message, actionText] = usePaymentErrorReason(reason)
  return (
    <Flex flexDirection='column' style={{ height: '100%' }}>
      <Flex alignItems='center' justifyContent='center' style={{ flexGrow: 1 }}>
        <Padding horizontal={40}>
          <GenericErrorLayout>
            <ErrorIconWithSeverity
              iconFallback={<Image name='bank-error' width='84px' />}
              iconStatusUrl=''
              iconUrl=''
            />
            <ErrorContent title={title} message={message} />
            <ActionsList>
              <Button data-e2e='close-action' nature='primary' onClick={buttonHandler}>
                {actionText}
              </Button>
            </ActionsList>
          </GenericErrorLayout>
        </Padding>
      </Flex>
    </Flex>
  )
}

export type Props = {
  reason: PlaidSettlementErrorReasons
  relinkHandler: () => void
}

export default PaymentAccountError
