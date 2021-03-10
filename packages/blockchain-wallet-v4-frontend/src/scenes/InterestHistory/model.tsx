import styled from 'styled-components'

import { TableCell, Text } from 'blockchain-info-components'
import { ErrorCartridge, GreyCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

export const AmountTableCell = styled(TableCell)`
  flex-direction: column;
  align-items: flex-end;
`

export const CoinAmountWrapper = styled(CoinDisplay)`
  justify-content: flex-end;
`

export const FiatAmountWrapper = styled(FiatDisplay)`
  justify-content: flex-end;
`

export const IconBackground = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 32px;
  background: ${props => props.theme[props.color]};
`

export const PendingTag = styled(GreyCartridge)`
  font-size: 12px;
  margin-left: 8px;
`
export const ErrorTag = styled(ErrorCartridge)`
  font-size: 12px;
  margin-left: 8px;
`

export const Value = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  color: ${props => props.theme.grey600};
  line-height: 1.5;
  * {
    font-size: 14px !important;
    font-weight: 500 !important;
    color: ${props => props.theme.grey600} !important;
  }
`

export const InterestTableCell = styled(TableCell)`
  align-items: center;
  > ${Value} {
    margin-left: 20px;
  }
`

export const ViewTransaction = styled(Text)`
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`
