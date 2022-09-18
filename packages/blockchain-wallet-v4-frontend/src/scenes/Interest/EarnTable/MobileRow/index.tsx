import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { CoinType } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Props as ParentProps, SuccessStateType } from '..'
import { RewardsTextContainer, StakingTextContainer } from '../EarnTable.model'
import {
  AmountContainer,
  CoinContainer,
  RateContainer,
  RightContainer,
  Wrapper
} from './MobileRow.model'

const MobileRow = ({
  coin,
  handleClick,
  interestAccountBalance,
  interestEligible,
  interestRates,
  product,
  stakingEligible,
  walletCurrency
}: Props): ReactElement => {
  const { coinfig } = window.coins[coin] || {}
  const { displaySymbol, name: displayName } = coinfig
  const account = interestAccountBalance && interestAccountBalance[coin]
  const accountBalanceBase = account ? account.balance : 0
  const interestEligibleCoin = interestEligible[coin] && interestEligible[coin]?.eligible
  const stakingEligibleCoin = stakingEligible[coin] && stakingEligible[coin]?.eligible
  const isStaking = product === 'Staking'

  return (
    <Wrapper
      onClick={() => handleClick(coin, isStaking)}
      disabled={isStaking ? !stakingEligibleCoin : !interestEligibleCoin}
    >
      <Icon name={coin} color={coin} size='32px' />
      <RightContainer>
        <CoinContainer>
          <Text color='grey900' size='16px' weight={600}>
            {displayName}
          </Text>
          <RateContainer>
            <Text color='grey700' size='14px' weight={500}>
              <FormattedMessage
                defaultMessage='Earn {interestRate}% APR'
                id='scenes.interest.earntable.mobilerow.earn'
                values={{
                  interestRate: interestRates[coin]
                }}
              />
            </Text>
            {isStaking ? (
              <StakingTextContainer>
                <Text color='grey900' size='12px' weight={600}>
                  {product}
                </Text>
              </StakingTextContainer>
            ) : (
              <RewardsTextContainer>
                <Text color='grey600' size='12px' weight={600}>
                  {product}
                </Text>
              </RewardsTextContainer>
            )}
          </RateContainer>
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
  handleClick: (coin: CoinType, isStaking: boolean) => void
  product: 'Staking' | 'Rewards'
}

type Props = ParentProps & SuccessStateType & OwnPropsType

export default MobileRow