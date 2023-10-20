import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Text } from 'blockchain-info-components'
import { CustomBoxRightOriented } from 'components/Layout'

import { Props as OwnProps, SuccessStateType } from './index'

type Props = OwnProps & SuccessStateType

const InterestBanner: React.FC<Props> = ({
  afterTransaction,
  interestActions,
  interestRates,
  userData
}) => {
  const { amount, currency } = afterTransaction
  const displayName = window.coins[currency].coinfig.name
  const isUserFromUK = userData?.address?.country === 'GB'
  return (
    <CustomBoxRightOriented>
      <div>
        <Text size='16px' color='grey900' weight={600} style={{ marginTop: '16px' }}>
          <FormattedMessage
            id='modals.simplebuy.interest_banner.title'
            defaultMessage='Earn {interestRate}% on this {displayName} Purchase'
            values={{
              displayName,
              interestRate: interestRates[currency]
            }}
          />
        </Text>
        {isUserFromUK && (
          <Text size='16px' color='grey900' weight={600} style={{ marginTop: '16px' }}>
            APYs are always indicative based on past performance and are not guaranteed. Find out
            more about Staking and Rewards as well as the risks{' '}
            <Link
              size='12px'
              href='https://support.blockchain.com/hc/en-us/articles/10857163796380-Staking-and-Rewards-what-are-the-risks'
              target='_blank'
              style={{ textDecoration: 'underline' }}
            >
              here
            </Link>
            .
          </Text>
        )}

        <Text
          size='14px'
          color='grey600'
          weight={500}
          style={{ lineHeight: 1.5, marginTop: '4px', maxWidth: '286px' }}
        >
          <FormattedMessage
            id='modals.simplebuy.interest_banner.description'
            defaultMessage='Send your {amount}{currency} to your {displayName} Rewards Account.'
            values={{
              amount,
              currency,
              displayName
            }}
          />
        </Text>
      </div>
      <Button
        style={{ marginTop: '16px', maxWidth: '144px' }}
        nature='light'
        data-e2e='earnInterestNow'
        onClick={() => {
          interestActions.showInterestModal({ coin: currency, step: 'DEPOSIT' })
        }}
      >
        <FormattedMessage
          id='modals.simplebuy.interest_banner.earn_now'
          defaultMessage='Earn Now ->'
        />
      </Button>
    </CustomBoxRightOriented>
  )
}

export default InterestBanner
