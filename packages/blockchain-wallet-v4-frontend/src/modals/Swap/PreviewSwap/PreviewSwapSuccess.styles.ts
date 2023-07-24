import styled from 'styled-components'

import { Row } from 'components/Flyout'

export const StyledRow = styled(Row)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 24px;

  & > div:first-child {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
export const ToolTipText = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  background-color: ${(props) => props.theme.grey000};

  animation: fadeIn 0.3s ease-in-out;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

export const ExchangeRateRow = styled.div`
  display: flex;
`
export const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
`

export const QuoteCountDownWrapper = styled.div`
  margin-top: 28px;
`
