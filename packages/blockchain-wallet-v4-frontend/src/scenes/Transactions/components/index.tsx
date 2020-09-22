import styled, { DefaultTheme } from 'styled-components'

import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

export const CustodialTransactionRow = styled.div`
  width: calc(100% - 14px);
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.grey000} !important;
  padding: 14px;
  padding-left: 0px;
  margin-left: 14px;
`
export const Col = styled.div<{ width: string }>`
  width: ${props => props.width};
`
export const IconWrapper = styled.div<{ color: keyof DefaultTheme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 16px;
  background: ${props => props.theme[props.color]};
`
export const Row = styled(Col)`
  display: flex;
  align-items: center;
`
export const StyledCoinDisplay = styled(CoinDisplay)`
  justify-content: flex-end;
`
export const StyledFiatDisplay = styled(FiatDisplay)`
  justify-content: flex-end;
`
