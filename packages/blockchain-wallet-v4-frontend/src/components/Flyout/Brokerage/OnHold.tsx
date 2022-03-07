import React, { memo } from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import { fiatToString } from '@core/exchange/utils'
import { FiatType, WithdrawalLock } from '@core/types'
import { Button, Link, Text, TextGroup } from 'blockchain-info-components'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
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
          <TextGroup inline>
            <Text weight={400} lineHeight='24px' size='14px' color='grey600'>
              <FormattedMessage
                id='modals.brokerage.withdraw_holding_period'
                defaultMessage='Newly added funds are subject to a holding period. You can transfer between your Trading, Rewards, and Exchange accounts in the meantime.'
              />
            </Text>
            <Link
              weight={400}
              size='14px'
              target='_blank'
              href='https://support.blockchain.com/hc/en-us/articles/360051018131-Trading-Account-Withdrawal-Holds'
            >
              <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
            </Link>
          </TextGroup>
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
              <FormattedMessage id='copy.held_until' defaultMessage='Held until' />
            </Text>
            <Text
              uppercase
              size='12px'
              weight={500}
              color='grey400'
              style={{ letterSpacing: '1px' }}
            >
              <FormattedMessage id='copy.amount' defaultMessage='Amount' />
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
              title={moment(expiresAt).format('MMMM Do YYYY')}
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
