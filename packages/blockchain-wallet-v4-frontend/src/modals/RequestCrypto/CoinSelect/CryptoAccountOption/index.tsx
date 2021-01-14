import React from 'react'
import styled from 'styled-components'

import { FiatType, SupportedCoinType } from 'core/types'
import { Icon } from 'blockchain-info-components'

// TODO: make these generic and share
import {
  BalanceRow,
  FlexStartRow,
  OptionTitle,
  OptionValue
} from '../../../Swap/components'
import CoinBalance from '../../../Swap/components/CoinBalance'

import { SwapAccountType } from 'data/components/swap/types'

export const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${props => `1px solid ${props.theme.grey000}`};
  padding: 16px 40px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.blue000};
  }
  &:first-child {
    border-top: 0;
  }
`

const CryptoAccountOption: React.FC<Props> = props => {
  const { account, coinModel, onClick, walletCurrency } = props

  return (
    <Option role='button' data-e2e='requestCoinSelect' onClick={onClick}>
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
              <CoinBalance account={account} walletCurrency={walletCurrency} />
            </BalanceRow>
          </OptionValue>
        </div>
      </FlexStartRow>
      <FlexStartRow>
        <Icon name='chevron-right' size='32px' color='grey400' />
      </FlexStartRow>
    </Option>
  )
}

type Props = {
  account: SwapAccountType
  coinModel: SupportedCoinType
  onClick: () => void
  walletCurrency: FiatType
}

export default CryptoAccountOption
