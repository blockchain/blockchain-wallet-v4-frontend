import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export const Top = styled(FlyoutWrapper)`
  padding-bottom: 0;
`
export const TopText = styled(Text)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 38px;
`
export const Row = styled.div`
  display: flex;
`
export const Container = styled(Row)`
  flex-direction: column;
  height: 48px;
  justify-content: space-between;

  &:first-child {
    border-right: 1px solid ${({ theme }) => theme.grey000};
    width: 199px;
  }

  &:last-child {
    margin-left: 32px;
  }
`
export const SendStatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 16px;
  padding: 16px;
  background-color: ${props => props.theme.greyFade400};
  border: 1px solid ${({ theme }) => theme.grey000};
  box-sizing: border-box;
  border-radius: 8px;
`
export const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 48px;
`
export const DetailsItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
export const LineVectorDetails = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.grey000};
  margin: 10px 0;
`
export const LineVector = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.grey000};
  margin: 24px 0 8px 0;
`
export const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 28px;
  > button {
    padding: 15px !important;
  }
`
export const ViewStatusButton = styled(Button)`
  height: 30px;
  width: 100px;
  padding: 0;
  margin-top: 8px;
`
