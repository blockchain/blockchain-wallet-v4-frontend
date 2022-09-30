import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { CoinType } from '@core/types'
import { Icon, Text, TooltipHost } from 'blockchain-info-components'
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
  isGoldTier,
  product,
  stakingAccountBalance,
  stakingEligible,
  walletCurrency
}: Props): ReactElement => {
  const { coinfig } = window.coins[coin] || {}
  const { displaySymbol, name: displayName } = coinfig
  const isStaking = product === 'Staking'
  const account = isStaking
    ? stakingAccountBalance && stakingAccountBalance[coin]
    : interestAccountBalance && interestAccountBalance[coin]
  const accountBalanceBase = account ? account.balance : 0
  const interestEligibleCoin = interestEligible[coin] && interestEligible[coin]?.eligible
  const stakingEligibleCoin = stakingEligible[coin] && stakingEligible[coin]?.eligible

  return (
    <Wrapper
      onClick={() => handleClick(coin, isStaking)}
      disabled={
        !isGoldTier ||
        (accountBalanceBase === 0 && (isStaking ? !stakingEligibleCoin : !interestEligibleCoin))
      }
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
                defaultMessage='Earn {interestRate}%'
                id='scenes.interest.earntable.mobilerow.earn'
                values={{
                  interestRate: interestRates[coin]
                }}
              />
            </Text>
            {isStaking ? (
              <TooltipHost id='earntable.staking.tooltip'>
                <StakingTextContainer>
                  <Text color='grey900' size='12px' weight={600}>
                    {product}
                  </Text>
                </StakingTextContainer>
              </TooltipHost>
            ) : (
              <TooltipHost id='earntable.rewards.tooltip'>
                <RewardsTextContainer>
                  <Text color='grey600' size='12px' weight={600}>
                    {product}
                  </Text>
                </RewardsTextContainer>
              </TooltipHost>
            )}
          </RateContainer>
        </CoinContainer>
        <AmountContainer>
          <FiatDisplay
            color='grey900'
            coin={coin}
            currency={walletCurrency}
            loadingHeight='24px'
            size='16px'
            style={{ lineHeight: '21px' }}
            weight={600}
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
