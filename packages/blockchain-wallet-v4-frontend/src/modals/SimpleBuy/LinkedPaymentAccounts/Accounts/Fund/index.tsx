import { convertBaseToStandard } from 'data/components/exchange/services'
import {
  DisplayContainer,
  DisplayIcon,
  MultiRowContainer
} from 'components/SimpleBuy'
import { fiatToString } from 'core/exchange/currency'
import { FiatType, SBBalanceType, SBPaymentMethodType } from 'core/types'
import { Title, Value } from 'components/Flyout'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import FiatDisplay from 'components/Display/FiatDisplay'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const DisplayMoney = styled.div`
  text-align: right;
`
const StyledFiatDisplay = styled(FiatDisplay)`
  justify-content: flex-end;
`

const Fund: React.FC<Props> = ({
  balances,
  icon,
  onClick,
  value,
  walletCurrency
}) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}Fund`}
    role='button'
    onClick={onClick}
  >
    <DisplayIcon>{icon}</DisplayIcon>
    <MultiRowContainer>
      <Value asTitle>{Currencies[value.currency].displayName}</Value>
      <Title asValue>{value.currency}</Title>
    </MultiRowContainer>
    <DisplayMoney>
      <Value asTitle>
        {fiatToString({
          value: convertBaseToStandard('FIAT', balances.available),
          unit: value.currency as FiatType
        })}
      </Value>
      {value.currency !== walletCurrency && (
        <StyledFiatDisplay
          coin={value.currency}
          size='14px'
          weight={500}
          color='grey600'
          style={{ marginTop: '4px', alignSelf: 'flex-end' }}
        >
          {convertBaseToStandard('FIAT', balances.available)}
        </StyledFiatDisplay>
      )}
    </DisplayMoney>
  </DisplayContainer>
)

type Props = {
  balances: SBBalanceType
  icon: ReactElement
  onClick: (string) => void
  value: SBPaymentMethodType
  walletCurrency: FiatType
}

export default Fund
