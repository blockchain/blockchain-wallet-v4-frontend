import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { SemanticColors, Text } from '@blockchain-com/constellation'

import { CoinType } from '@core/types'
import { Icon, TooltipHost } from 'blockchain-info-components'
import { RoundedBadge } from 'components/Badge'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { EarnProductsType } from 'data/types'

import { Props as ParentProps, SuccessStateType } from '..'
import Tag from '../Tag'
import { AmountContainer, CoinContainer, RightContainer, Row, Wrapper } from './MobileRow.styles'

const MobileRow = ({
  activeRewardsAccountBalance,
  activeRewardsEligible,
  activeRewardsRates,
  coin,
  handleClick,
  interestEligible,
  interestRates,
  isGoldTier,
  passiveRewardsAccountBalance,
  product,
  stakingAccountBalance,
  stakingEligible,
  stakingRates,
  walletCurrency
}: Props): ReactElement | null => {
  const { coinfig } = window.coins[coin] || {}
  const { displaySymbol, name: displayName } = coinfig
  let account
  let earnRate
  let isCoinEligible
  let showNewTag = false
  let isActiveRewards = false

  switch (product) {
    case 'Staking': {
      account = stakingAccountBalance && stakingAccountBalance[coin]
      earnRate = stakingRates[coin].rate
      isCoinEligible = stakingEligible[coin]?.eligible
      showNewTag = true
      break
    }
    case 'Active': {
      account = activeRewardsAccountBalance && activeRewardsAccountBalance[coin]
      earnRate = activeRewardsRates[coin].rate
      isCoinEligible = activeRewardsEligible[coin]?.eligible
      showNewTag = true
      isActiveRewards = true
      break
    }
    case 'Passive':
    default: {
      account = passiveRewardsAccountBalance && passiveRewardsAccountBalance[coin]
      earnRate = interestRates[coin]
      isCoinEligible = interestEligible[coin]?.eligible
      break
    }
  }
  const accountBalanceBase = account ? account.balance : 0
  const hasAccountBalance = accountBalanceBase > 0
  return (
    <Wrapper
      onClick={() => handleClick(coin, product)}
      disabled={!isGoldTier || (!hasAccountBalance && !isCoinEligible)}
    >
      <Icon name={coin} color={coin} size='32px' />
      <RightContainer>
        <CoinContainer>
          <Row>
            <Text color={SemanticColors.title} variant='paragraph1'>
              {displayName}
            </Text>
            {showNewTag && (
              <RoundedBadge>
                <FormattedMessage defaultMessage='New' id='copy.new' />
              </RoundedBadge>
            )}
          </Row>
          <Row>
            {hasAccountBalance ? (
              <Tag backgroundColor='background-green'>
                <Text color={SemanticColors.success} variant='caption2'>
                  {isActiveRewards ? (
                    <FormattedMessage
                      defaultMessage='Earning up to {earnRate}%'
                      id='scene.earn.earnrate-upto'
                      values={{ earnRate }}
                    />
                  ) : (
                    <FormattedMessage
                      defaultMessage='Earning {earnRate}%'
                      id='scene.earn.earnrate'
                      values={{ earnRate }}
                    />
                  )}
                </Text>
              </Tag>
            ) : (
              <Text color={SemanticColors.body} variant='caption1'>
                <FormattedMessage
                  defaultMessage='Earn {interestRate}%'
                  id='scenes.interest.Table.mobilerow.earn'
                  values={{
                    interestRate: interestRates[coin]
                  }}
                />
              </Text>
            )}
            <TooltipHost id={`Table.${product.toLowerCase()}.tooltip`}>
              <Tag backgroundColor='background' borderColor='background-light'>
                <Text color={SemanticColors.body} variant='caption2'>
                  {product}
                </Text>
              </Tag>
            </TooltipHost>
          </Row>
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
  handleClick: (coin: CoinType, product: EarnProductsType) => void
  product: EarnProductsType
}

type Props = ParentProps & SuccessStateType & OwnPropsType

export default MobileRow
