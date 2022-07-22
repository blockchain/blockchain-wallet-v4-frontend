import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Image } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import {
  ActionsList,
  ErrorContent,
  ErrorIconWithSeverity,
  GenericErrorLayout
} from 'components/GenericError'
import { Padding } from 'components/Padding'

const RefreshPaymentAccount = () => {
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
            <ErrorContent
              title={
                <FormattedMessage
                  id='modals.brokerage.plaid_refresh_error.title'
                  defaultMessage='One last thing...'
                />
              }
              message={
                <FormattedMessage
                  id='modals.brokerage.plaid_refresh_error.message'
                  defaultMessage='We need to quickly relink your bank account. The process will only take a minute.'
                />
              }
            />
            <ActionsList>
              <Button data-e2e='close-action' nature='primary' onClick={() => {}}>
                <FormattedMessage id='copy.relink' defaultMessage='Relink' />
              </Button>
            </ActionsList>
          </GenericErrorLayout>
        </Padding>
      </Flex>
    </Flex>
  )
}

export type Props = {}

export default RefreshPaymentAccount
