import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { CustomBoxRightOriented } from 'components/Layout'
import { model } from 'data'

import { Props as OwnProps, SuccessStateType } from './index'

type Props = OwnProps & SuccessStateType

const InterestBanner: React.FC<Props> = ({
  afterTransaction,
  analyticsActions,
  interestActions,
  interestRate
}) => {
  const { amount, currency } = afterTransaction
  const displayName = window.coins[currency].coinfig.name
  return (
    <CustomBoxRightOriented>
      <div>
        <Text size='16px' color='grey900' weight={600} style={{ marginTop: '16px' }}>
          <FormattedMessage
            id='modals.simplebuy.interest_banner.title'
            defaultMessage='Earn {interestRate}% on this {displayName} Purchase'
            values={{
              displayName,
              interestRate: interestRate[currency]
            }}
          />
        </Text>
        <Text
          size='14px'
          color='grey600'
          weight={500}
          style={{ lineHeight: 1.5, marginTop: '4px', maxWidth: '286px' }}
        >
          <FormattedMessage
            id='modals.simplebuy.interest_banner.description'
            defaultMessage='Send your {amount}{currency} to your {displayName} Interest Account.'
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
          interestActions.showInterestModal('DEPOSIT', currency)
          analyticsActions.logEvent(model.analytics.ONE_CLICK_INTEREST.CLICK)
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
