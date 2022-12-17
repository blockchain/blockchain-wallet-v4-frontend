import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Text } from '@blockchain-com/constellation'

import { CheckoutRow } from 'components/Rows'

import useTitle from './hooks/useTitle'
import useValue from './hooks/useValue'
import { AvailabilityRowsComponent } from './types'

const AvailabilityRows: AvailabilityRowsComponent = ({ depositTerms }) => {
  const tradeTitle = useTitle('Trade')
  const tradeValue = useValue('Trade', depositTerms)
  const withdrawTitle = useTitle('Withdraw')
  const withdrawValue = useValue('Withdraw', depositTerms)

  return (
    <>
      {tradeValue ? <CheckoutRow text={tradeValue} title={tradeTitle} /> : null}
      {withdrawValue ? (
        <CheckoutRow
          text={withdrawValue}
          title={withdrawTitle}
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
