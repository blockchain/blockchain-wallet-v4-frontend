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
import { AmountContainer, CoinContainer, RightContainer, Row, Wrapper } from './MobileRow.model'

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
}: Props): ReactElement | null => {
  const isStaking = product === 'Staking'
  const account = isStaking
    ? stakingAccountBalance && stakingAccountBalance[coin]
    : interestAccountBalance && interestAccountBalance[coin]
  const accountBalanceBase = account ? account.balance : 0
  const hasAccountBalance = accountBalanceBase > 0

  const { coinfig } = window.coins[coin] || {}
  const { displaySymbol, name: displayName } = coinfig

  const isInterestCoinEligible = interestEligible[coin]?.eligible
  const isStakingCoinEligible = stakingEligible[coin]?.eligible
  const isCoinEligible = isStaking ? !isStakingCoinEligible : !isInterestCoinEligible
  return (
    <Wrapper
      onClick={() => handleClick(coin, isStaking)}
      disabled={!isGoldTier || (!hasAccountBalance && isCoinEligible)}
    >
      <Icon name={coin} color={coin} size='32px' />
      <RightContainer>
        <CoinContainer>
          <Row>
            <Text color={SemanticColors.title} variant='paragraph1'>
              {displayName}
            </Text>
            {isStaking && (
              <RoundedBadge>
                <FormattedMessage defaultMessage='New' id='copy.new' />
              </RoundedBadge>
            )}
          </Row>
          <Row>
            {hasAccountBalance ? (
              <Tag backgroundColor='background-green'>
                <Text color={SemanticColors.success} variant='caption2'>
                  <FormattedMessage
                    defaultMessage='Earning {earnRate}%'
                    id='scene.earn.earnrate'
                    values={{ earnRate: interestRates[coin] }}
                  />
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
  handleClick: (coin: CoinType, isStaking: boolean) => void
  product: EarnProductsType
}

type Props = ParentProps & SuccessStateType & OwnPropsType

export default MobileRow
