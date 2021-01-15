import React from 'react'
import styled, { css } from 'styled-components'

import { FiatType, SupportedCoinType } from 'core/types'
import { Icon, Text } from 'blockchain-info-components'
import { SwapAccountType } from 'data/components/swap/types'

// TODO: make these generic and share
import {
  BalanceRow,
  FlexStartRow,
  OptionTitle,
  OptionValue
} from '../Swap/components'
import CoinBalance from '../Swap/components/CoinBalance'

export const REQUEST_FORM = 'requestCrypto'

export const StepHeader = styled(Text)<{
  marginBottom?: boolean
  spaceBetween?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: ${props =>
    props.spaceBetween ? 'space-between' : 'initial'};
  margin-bottom: ${props => (props.marginBottom ? '24px' : '0px')};
`

export const Option = styled.div<{ displayOnly?: boolean }>`
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

export const CryptoAccountOption: React.FC<CryptoAccountOptionProps> = props => {
  const {
    account,
    coinModel,
    displayOnly,
    hideActionIcon,
    onClick,
    walletCurrency
  } = props

  return (
    <Option
      role='button'
      data-e2e='requestCoinSelect'
      displayOnly={displayOnly}
      onClick={onClick}
    >
      <FlexStartRow>
        <Icon
          name={coinModel.icons.circleFilled}
          color={coinModel.colorCode}
          size='32px'
          style={{ marginRight: '16px' }}
        />
        <div>
          <OptionTitle>{account.label}</OptionTitle>
          <OptionValue>
            <BalanceRow>
              <CoinBalance
                account={account}
                displayOnly={displayOnly}
                walletCurrency={walletCurrency}
              />
            </BalanceRow>
          </OptionValue>
        </div>
      </FlexStartRow>
      {!hideActionIcon && (
        <FlexStartRow>
          <Icon name='chevron-right' size='32px' color='grey400' />
        </FlexStartRow>
      )}
    </Option>
  )
}

type CryptoAccountOptionProps = {
  account: SwapAccountType
  coinModel: SupportedCoinType
  displayOnly?: boolean
  hideActionIcon?: boolean
  onClick?: () => void
  walletCurrency: FiatType
}
