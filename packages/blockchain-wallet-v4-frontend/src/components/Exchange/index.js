import styled from 'styled-components'
import { Text, Button } from 'blockchain-info-components'

export const Wrapper = styled.div`
  padding: 32px;
  max-width: 440px;
  border: 1px solid ${props => props.theme['gray-1']}};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
export const ExchangeText = styled(Text)`
  font-size: 14px;
  line-height: 20px;
  font-weight: 300;
`
export const Title = styled(Text)`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 24px;
`
export const AmountHeader = styled(ExchangeText)`
  color: ${props => props.theme['gray-5']};
  font-size: 16px;
`
export const Delimiter = styled.div`
  border-bottom: 1px solid ${props => props.theme['gray-1']}};
  width: 100%;
  margin-top: 6px;
  margin-bottom: 25px;
`
export const TableRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
  box-sizing: border-box;
  padding: 18px;
  width: 100%;
`
export const Note = styled(Text)`
  font-size: 12px;
  line-height: 14px;
  margin-top: 12px;
  margin-bottom: 28px;
  font-weight: 300;
`
export const ExchangeButton = styled(Button)`
  margin-left: 30px;
  margin-right: 30px;
  width: calc(100% - 60px);
`
export const CancelButton = styled(ExchangeButton)`
  border: none;
  margin-top: 10px;
`
export const ExchangeAmounts = styled.div``
export const ExchangeAmount = styled(Text)`
  font-weight: 400;
  font-size: 17px;
  line-height: 20px;
  text-align: right;
  color: ${props => props.theme[props.color || 'brand-primary']};
`
export const SubExchangeAmount = styled(ExchangeAmount)`
  text-align: right;
  font-weight: 300;
  font-size: 13px;
  color: ${props => props.theme['gray-4']};
`
