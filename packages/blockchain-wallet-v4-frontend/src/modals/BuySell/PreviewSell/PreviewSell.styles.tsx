import { Form } from 'redux-form'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { FlyoutWrapper, Row } from 'components/Flyout'

export const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const RowItem = styled(Row)`
  display: flex;
  justify-content: space-between;
`
export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`

export const RowIcon = styled.div`
  display: flex;
`

export const RowItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
export const RowTextWrapper = styled.div`
  text-align: right;
`
export const RowText = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.grey900};
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export const AdditionalText = styled(Text)`
  font-weight: 500;
  color: ${(props) => props.theme.grey400};
  text-align: right;
  font-size: 14px;
`
export const ToolTipText = styled.div`
  display: flex;
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

export const Amount = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  > div {
    display: flex;
    flex-direction: row;
  }
`
export const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  height: 100%;
`

export const BottomActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1;
`

export const DisclaimerText = styled(Text)`
  display: flex;
  font-size: 14px;
  font-weight: 500;
  margin-top: 24px;
  text-align: left;
  a {
    color: ${(props) => props.theme.blue600};
    cursor: pointer;
    text-decoration: none;
    display: contents;
  }
`
