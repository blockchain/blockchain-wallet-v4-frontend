import React from 'react'
import styled from 'styled-components'

import { FiatType, SupportedWalletCurrenciesType } from 'core/types'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import { SuccessCartridge } from 'components/Cartridge'
import { SwapAccountType } from 'data/types'

import {
  BalanceRow,
  CircleBorder,
  FlexStartRow,
  Option,
  OptionTitle,
  OptionValue
} from '../../components'
import CoinBalance from '../../components/CoinBalance'

const LowFeeCartridge = styled(SuccessCartridge)`
  font-size: 12px;
  padding: 6px;
`

const CryptoAccountOption: React.FC<Props> = props => {
  const { account, coins, isAccountSelected, isSwap, walletCurrency } = props
  return (
    <Option role='button' data-e2e='changeAcct' onClick={props.onClick}>
      <FlexStartRow>
        <Icon
          name={coins[account.coin].icons.circleFilled}
          color={coins[account.coin].colorCode}
          size='32px'
          style={{ marginRight: '12px' }}
        />
        <div>
          <OptionTitle data-e2e={account.label}>{account.label}</OptionTitle>
          <OptionValue>
            <BalanceRow>
              <CoinBalance account={account} walletCurrency={walletCurrency} />
            </BalanceRow>
          </OptionValue>
        </div>
      </FlexStartRow>
      <FlexStartRow>
        {account.type === 'CUSTODIAL' && (
          <LowFeeCartridge>
            <FormattedMessage
              id='scenes.swap.low_fees'
              defaultMessage='Low Fees'
            />
          </LowFeeCartridge>
        )}
        {isSwap ? (
          isAccountSelected ? (
            <Icon
              name='checkmark-circle-filled'
              color='green600'
              size='24px'
              style={{ padding: '0 2px', marginLeft: '24px' }}
            />
          ) : (
            <CircleBorder />
          )
        ) : (
          <Icon name='chevron-right' size='32px' color='grey400' />
        )}
      </FlexStartRow>
    </Option>
  )
}

type Props = {
  account: SwapAccountType
  coins: SupportedWalletCurrenciesType
  isAccountSelected: boolean
  isSwap: boolean
  onClick: () => void
  walletCurrency: FiatType
}

export default CryptoAccountOption
