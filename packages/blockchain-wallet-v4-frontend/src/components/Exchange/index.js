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
  margin-bottom: 8px;
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
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
  height: 20px;
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
export const ExchangeAmount = styled(Text)`
  font-weight: 400;
  font-size: 17px;
  line-height: 20px;
  color: ${props => props.theme['brand-primary']};
`
