import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

import { AutosizeTextBox } from '../Form'
import { ResizeableFontInput } from '../Form/ResizeableFontInput'

export const Wrapper = styled.div`
  padding: 32px;
  max-width: 440px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
export const AmountTextBox = styled(ResizeableFontInput(AutosizeTextBox))<{
  fiatActive: boolean
}>`
  height: 86px;
  max-width: ${({ fiatActive }) => (fiatActive ? '100%' : '75%')};
  > div {
    border: none;
    height: 100%;
    padding: 0;
    display: flex !important;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }
  input {
    outline: 0;
    position: relative;
    font-weight: 500;
    font-size: 62px;
    line-height: 88px;
    height: 88px;
    padding: 0;
    width: 100%;
    min-width: 45px;
    max-width: 100%;
    border: none;
    text-align: center;
    color: ${props => props.theme.textBlack};
    background-color: ${props => props.theme.white};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
  }
`
export const ExchangeText = styled(Text)`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
`
export const Title = styled(Text)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 24px;
`
export const AmountHeader = styled(ExchangeText)`
  color: ${props => props.color || props.theme.grey700};
  font-size: 16px;
`
export const TableRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 8px 0;
  width: 100%;
`
export const LargeTableRow = styled(TableRow)`
  padding: 10px 18px;
  min-height: 72px;
  border-bottom: 1px solid ${props => props.theme.grey000};
  &:last-child {
    border-bottom: 0px;
  }
`
export const Note = styled(Text)`
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 28px;
  font-weight: 400;
  text-align: center;
  margin-top: 16px;
  color: ${props => props.theme['grey500']};
`
export const ExchangeButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 18px;
`
export const ExchangeAmounts = styled.div``
export const ExchangeAmount = styled(Text)`
  display: flex;
  font-weight: 500;
  font-size: 17px;
  line-height: 20px;
  color: ${props => props.theme[props.color || 'blue900']};
`
export const SubExchangeAmount = styled(ExchangeAmount)`
  margin-top: 2px;
  text-align: right;
  font-weight: 400;
  font-size: 13px;
  color: ${props => props.theme[props.color || 'grey500']};
`
