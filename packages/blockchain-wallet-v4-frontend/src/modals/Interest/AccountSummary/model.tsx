import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
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
  min-height: 48px;
  justify-content: space-between;

  &:first-child {
    border-right: 1px solid ${({ theme }) => theme.grey000};
    width: 199px;
  }

  &:last-child {
    margin-left: 32px;
  }
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
  display: flex;
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
export const StatusWrapper = styled.div`
  display: flex;
  padding: 4px;
  margin-top: 20px;
  align-items: center;
`

export const StatusSupplyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  margin-top: 32px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.grey000};
`
export const StatusIconWrapper = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  background: ${(props) => props.theme[props.color]};
  border-radius: 20px;
  min-height: 38px;
  min-width: 38px;
  max-height: 38px;
`
export const LinkWrapper = styled.div`
  padding: 16px 0;
`
