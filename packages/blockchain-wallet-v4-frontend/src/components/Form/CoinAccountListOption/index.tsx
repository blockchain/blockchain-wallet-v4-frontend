import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css, DefaultTheme } from 'styled-components'

import { CoinAccountIcon, Icon, Text } from 'blockchain-info-components'
import { FiatType, SupportedCoinType } from 'blockchain-wallet-v4/src/types'
import { SuccessCartridge } from 'components/Cartridge'
import { SwapAccountType } from 'data/types'

import CoinAccountListBalance from '../CoinAccountListBalance'

const Option = styled.div<{ displayOnly?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${props => `1px solid ${props.theme.grey000}`};
  padding: 16px 40px;
  &:first-child {
    border-top: 0;
  }

  ${props =>
    !props.displayOnly &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${props => props.theme.blue000};
      }
    `}
`

const OptionTitle = styled(Text)`
  color: ${props => props.theme.grey800};
  font-weight: 600;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const OptionValue = styled(Text)<{
  color?: keyof DefaultTheme
  weight?: number
}>`
  color: ${props => props.color || props.theme.grey600};
  margin-top: 4px;
  font-weight: ${props => (props.weight ? props.weight : 600)};
  font-size: 14px;
`
const BalanceRow = styled.div`
  display: flex;
  align-items: center;
`

const FlexStartRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const CircleBorder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: white;
  border: 1px solid ${props => props.theme.grey300};
  border-radius: 24px;
  margin-left: 18px;
`

const LowFeeCartridge = styled(SuccessCartridge)`
  font-size: 12px;
  padding: 6px;
`

const CoinAccountListOption: React.FC<Props> = props => {
  const {
    account,
    coinModel,
    displayOnly,
    hideActionIcon,
    isAccountSelected,
    isSwap,
    showLowFeeBadges,
    walletCurrency
  } = props

  return (
    <Option
      data-e2e='changeAcct'
      displayOnly={displayOnly}
      onClick={props.onClick}
      role='button'
    >
      <FlexStartRow>
        <CoinAccountIcon
          accountType={account.type}
          coin={coinModel.coinCode}
          style={{ marginRight: '12px' }}
        />
        <div>
          <OptionTitle data-e2e={account.label}>{account.label}</OptionTitle>
          <OptionValue>
            <BalanceRow>
              <CoinAccountListBalance
                account={account}
                displayOnly={displayOnly}
                walletCurrency={walletCurrency}
              />
            </BalanceRow>
          </OptionValue>
        </div>
      </FlexStartRow>
      <FlexStartRow>
        {showLowFeeBadges && account.type === 'CUSTODIAL' && (
          <LowFeeCartridge>
            <FormattedMessage
              id='scenes.swap.low_fees'
              defaultMessage='Low Fees'
            />
          </LowFeeCartridge>
        )}
        {isSwap && isAccountSelected && (
          <Icon
            name='checkmark-circle-filled'
            color='green600'
            size='24px'
            style={{ padding: '0 2px', marginLeft: '24px' }}
          />
        )}
        {isSwap && !isAccountSelected && <CircleBorder />}
        {!isSwap && !hideActionIcon && (
          <Icon name='chevron-right' size='32px' color='grey400' />
        )}
      </FlexStartRow>
    </Option>
  )
}

type Props = {
  account: SwapAccountType
  coinModel: SupportedCoinType
  displayOnly?: boolean
  hideActionIcon?: boolean
  isAccountSelected?: boolean
  isSwap?: boolean
  onClick?: () => void
  showLowFeeBadges?: boolean
  walletCurrency: FiatType
}

export default CoinAccountListOption
