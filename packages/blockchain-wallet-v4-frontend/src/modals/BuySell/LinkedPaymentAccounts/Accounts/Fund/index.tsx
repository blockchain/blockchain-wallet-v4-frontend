import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Currencies from '@core/exchange/currencies'
import { fiatToString } from '@core/exchange/utils'
import { BSBalanceType, BSPaymentMethodType, FiatType } from '@core/types'
import { DisplayContainer, DisplayIcon, MultiRowContainer } from 'components/BuySell'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title, Value } from 'components/Flyout'
import { convertBaseToStandard } from 'data/components/exchange/services'

const DisplayMoney = styled.div`
  text-align: right;
`
const StyledFiatDisplay = styled(FiatDisplay)`
  justify-content: flex-end;
`

const Fund: React.FC<Props> = ({ balances, icon, onClick, value, walletCurrency }) => (
  <DisplayContainer data-e2e={`sb${value.type.toLowerCase()}Fund`} role='button' onClick={onClick}>
    <DisplayIcon>{icon}</DisplayIcon>
    <MultiRowContainer>
      <Value asTitle>{Currencies[value.currency].displayName}</Value>
      <Title asValue>{value.currency}</Title>
    </MultiRowContainer>
    <DisplayMoney>
      <Value asTitle>
        {fiatToString({
          unit: value.currency as FiatType,
          value: convertBaseToStandard('FIAT', balances.available)
        })}
      </Value>
      {value.currency !== walletCurrency && (
        <StyledFiatDisplay
          coin={value.currency}
          size='14px'
          weight={500}
          color='grey600'
          style={{ alignSelf: 'flex-end', marginTop: '4px' }}
        >
          {convertBaseToStandard('FIAT', balances.available)}
        </StyledFiatDisplay>
      )}
    </DisplayMoney>
  </DisplayContainer>
)

type Props = {
  balances: BSBalanceType
  icon: ReactElement
  onClick: (string) => void
  value: BSPaymentMethodType
  walletCurrency: FiatType
}

export default Fund
