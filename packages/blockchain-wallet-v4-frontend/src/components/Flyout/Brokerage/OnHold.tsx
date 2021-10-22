import React, { memo } from 'react'
import { FormattedMessage } from 'react-intl'
import { format } from 'date-fns'

import { fiatToString } from '@core/exchange/utils'
import { FiatType, WithdrawalLock } from '@core/types'
import { Button, Text } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent, FlyoutFooter, FlyoutHeader } from 'components/Flyout'
import { CheckoutRow } from 'components/Rows'
import { convertBaseToStandard } from 'data/components/exchange/services'

const OnHold = ({ fiatCurrency, handleHeaderClick, locks, totalLockedAmount }: Props) => {
  return (
    <FlyoutContainer>
      <FlyoutHeader mode='close' data-e2e='fundsOnHoldFlyout' onClick={handleHeaderClick}>
        <FormattedMessage id='copy.on_hold' defaultMessage='On Hold' />
      </FlyoutHeader>
      <FlyoutContent mode='top'>
        <div style={{ padding: '0 40px 32px' }}>
          <Text weight={400} lineHeight='24px' size='16px' color='grey600'>
            <FormattedMessage
              id='modals.brokerage.withdraw_holding_period'
              defaultMessage='Newly added funds are subject to a holding period. You can transfer between your Trading, Rewards, and Exchange accounts in the meantime.'
            />
          </Text>
        </div>
        <div>
          <CheckoutRow
            text={fiatToString({
              unit: fiatCurrency as FiatType,
              value: convertBaseToStandard('FIAT', totalLockedAmount)
            })}
            title={<FormattedMessage id='copy.on_hold' defaultMessage='On Hold' />}
          />
        </div>
        {locks.length > 0 && (
          <div
            style={{ display: 'flex', justifyContent: 'space-between', padding: '32px 40px 9px' }}
          >
            <Text
              uppercase
              size='12px'
              weight={500}
              color='grey400'
              style={{ letterSpacing: '1px' }}
            >
              Clear Date
            </Text>
            <Text
              uppercase
              size='12px'
              weight={500}
              color='grey400'
              style={{ letterSpacing: '1px' }}
            >
              Amount
            </Text>
          </div>
        )}
        {locks.map(({ amount, expiresAt }) => {
          return (
            <CheckoutRow
              key={expiresAt}
              text={fiatToString({
                unit: amount.currency as FiatType,
                value: convertBaseToStandard('FIAT', amount.amount)
              })}
              title={format(new Date(expiresAt), 'MMMM dd')}
            />
          )
        })}
      </FlyoutContent>
      <FlyoutFooter>
        <Button fullwidth nature='primary' onClick={handleHeaderClick} data-e2e='onHoldGotItButton'>
          <FormattedMessage id='copy.got_it' defaultMessage='Got It' />
        </Button>
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

export type Props = {
  fiatCurrency: FiatType
  handleHeaderClick: () => void
  locks: WithdrawalLock[]
  totalLockedAmount: string
}

export default memo(OnHold)
