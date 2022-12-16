import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Text } from '@blockchain-com/constellation'

import { CheckoutRow } from 'components/Rows'

import { AvailabilityRowsComponent } from './types'
import { ParseDepositTerms } from './util'

const AvailabilityRows: AvailabilityRowsComponent = ({ depositTerms }) => {
  if (!depositTerms) return null
  const { trade, withdraw } = ParseDepositTerms(depositTerms)
  return (
    <>
      {trade ? <CheckoutRow text={trade.value} title={trade.title} /> : null}
      {withdraw ? (
        <CheckoutRow
          text={withdraw.value}
          title={withdraw.title}
          toolTip={
            <Flex flexDirection='column'>
              <Text as='span' variant='paragraph2'>
                <FormattedMessage
                  id='modal.reservelearn.availablefunds'
                  defaultMessage='Available to withdraw or send'
                />
              </Text>
              <Text as='p' variant='caption1'>
                <FormattedMessage
                  id='copy.withdrawal_holds_protect'
                  defaultMessage='Withdrawal holds protect you from fraud and theft if your Blockchain.com account is compromised. The hold period starts once funds are received in your account.'
                />
              </Text>
            </Flex>
          }
        />
      ) : null}
    </>
  )
}

export default AvailabilityRows
