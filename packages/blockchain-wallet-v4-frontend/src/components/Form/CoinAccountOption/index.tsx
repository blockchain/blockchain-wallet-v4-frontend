import React from 'react'
import styled, { css, DefaultTheme } from 'styled-components'

import { FiatType } from '@core/types'
import { CoinAccountIcon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { SwapAccountType } from 'data/types'

const Option = styled.div<{ displayOnly?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${(props) => `1px solid ${props.theme.grey000}`};
  padding: 16px 40px;
  &:first-child {
    border-top: 0;
  }

  ${(props) =>
    !props.displayOnly &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${(props) => props.theme.blue000};
      }
    `}
`

const OptionTitle = styled(Text)`
  color: ${(props) => props.theme.grey800};
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
  color: ${(props) => props.color || props.theme.grey600};
  margin-top: 4px;
  font-weight: ${(props) => (props.weight ? props.weight : 600)};
  font-size: 14px;
`
const BalanceRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const FlexStartRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const CoinAccountOption: React.FC<Props> = (props) => {
  const { account, coin, displayOnly, walletCurrency } = props

  return (
    <Option
      className='coin-account-option'
      data-e2e='changeAcct'
      displayOnly={displayOnly}
      onClick={props.onClick}
      role='button'
    >
      <FlexStartRow>
        <CoinAccountIcon accountType={account.type} coin={coin} style={{ marginRight: '12px' }} />
        <div>
          <OptionTitle data-e2e={account.label}>{account.label}</OptionTitle>
          <OptionValue>{coin}</OptionValue>
        </div>
      </FlexStartRow>
      <FlexStartRow>
        <BalanceRow>
          <CoinDisplay
            size='16px'
            color='grey900'
            coin={account.coin}
            weight={600}
            loadingHeight='24px'
            style={{
              cursor: !displayOnly ? 'pointer' : 'auto',
              lineHeight: 1.25
            }}
          >
            {account.balance}
          </CoinDisplay>

          <FiatDisplay
            size='14px'
            color='grey600'
            coin={account.coin}
            currency={walletCurrency}
            style={{
              cursor: !displayOnly ? 'pointer' : 'auto',
              lineHeight: 1.25
            }}
            weight={500}
          >
            {account.balance}
          </FiatDisplay>
        </BalanceRow>
      </FlexStartRow>
    </Option>
  )
}

type Props = {
  account: SwapAccountType
  coin: string
  displayOnly?: boolean
  onClick?: () => void
  walletCurrency: FiatType
}

export default CoinAccountOption
