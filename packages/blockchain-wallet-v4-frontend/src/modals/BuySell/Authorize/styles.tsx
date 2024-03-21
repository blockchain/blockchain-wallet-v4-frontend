import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { FlyoutWrapper, Row, Title } from 'components/Flyout'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
export const BackContainer = styled(Text)`
  display: flex;
  align-items: center;
  width: 100%;
  font-weight: 600;
  font-size: 20px;
`
export const DropdownTitleRow = styled.div<{ isPaymentInformation?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: ${(props) => (props.isPaymentInformation ? '0 40px' : 'auto')};
  /* chevorn icon rotation */
  > span:last-child {
    size: 10px;
    transition: transform 0.2s;
    color: ${(props) => props.theme.grey600};
    &.active {
      transform: rotate(180deg);
    }
  }
`
export const InfoTitle = styled(Title)`
  font-weight: 600;
  line-height: 1.5;
  color: ${(props) => props.theme.grey900};
`

export const InfoDropdown = styled.div`
  max-height: 0;
  margin-top: 0;
  overflow: hidden;
  transition: max-height, margin-top 0.3s;
  &.isToggled {
    max-height: 100%;
    margin-top: 12px;
  }
`
export const InfoText = styled(Title)`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.grey600};
  line-height: 1.5;
`
export const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`
export const DropdownRow = styled(Row)<{ isPaymentInformation?: boolean }>`
  padding: ${(props) => (props.isPaymentInformation ? '16px 0' : 'auto')};
`
