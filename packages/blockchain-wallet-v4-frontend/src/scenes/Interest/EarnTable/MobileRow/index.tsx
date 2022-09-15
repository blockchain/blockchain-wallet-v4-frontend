import React, { ReactElement, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'

import { CoinType } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Analytics } from 'data/types'

import { Props as ParentProps, SuccessStateType } from '..'
import { AmountContainer, CoinContainer, RightContainer, Wrapper } from './MobileRow.model'

const MobileRow = ({
  analyticsActions,
  coin,
  interestAccountBalance,
  interestActions,
  interestRates,
  walletCurrency
}: Props): ReactElement => {
  const { coinfig } = window.coins[coin] || {}
  const { displaySymbol, name: displayName } = coinfig
  const account = interestAccountBalance && interestAccountBalance[coin]
  const accountBalanceBase = account ? account.balance : 0

  const handleClick = useCallback(() => {
    analyticsActions.trackEvent({
      key: Analytics.WALLET_REWARDS_DETAIL_CLICKED,
      properties: {
        currency: coin
      }
    })
    interestActions.showInterestModal({ coin, step: 'ACCOUNT_SUMMARY' })
  }, [analyticsActions, coin, interestActions])

  return (
    <Wrapper onClick={handleClick}>
      <Icon name={coin} color={coin} size='32px' />
      <RightContainer>
        <CoinContainer>
          <Text color='grey900' size='16px' weight={600}>
            {displayName}
          </Text>
          <Text color='grey700' size='14px' weight={500}>
            <FormattedMessage
              defaultMessage='Earn {interestRate}% APR'
              id='scenes.interest.earntable.mobilerow.earn'
              values={{
                interestRate: interestRates[coin]
              }}
            />
          </Text>
        </CoinContainer>
        <AmountContainer>
          <FiatDisplay
            color='grey900'
            coin={coin}
            currency={walletCurrency}
            loadingHeight='24px'
            size='14px'
            style={{ lineHeight: '21px' }}
            weight={500}
          >
            {accountBalanceBase}
          </FiatDisplay>
          <CoinDisplay
            coin={coin}
            size='14px'
            color='grey700'
            cursor='inherit'
            weight={500}
            data-e2e={`${displaySymbol}Balance`}
          >
            {accountBalanceBase}
          </CoinDisplay>
        </AmountContainer>
      </RightContainer>
    </Wrapper>
  )
}

type OwnPropsType = {
  coin: CoinType
}

type Props = ParentProps & SuccessStateType & OwnPropsType

export default MobileRow
