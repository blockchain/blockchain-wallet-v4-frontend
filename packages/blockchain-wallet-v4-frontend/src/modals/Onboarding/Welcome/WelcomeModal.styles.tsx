import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

export const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export const Column = styled.div`
  display: flex;
  flex-direction: column;
`
export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;

  span {
    margin-left: 8px;
  }
`
export const ContentContainer = styled(Column)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 70px;
  padding: 40px;
  text-align: center;
`
export const IconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  min-width: 48px;
  background-color: ${(props) => props.theme.blue000};
  border-radius: 48px;
`

export const Title = styled(Text)`
  margin: 26px 0 13px;
`

export const ContentTextWrapper = styled(Text)`
  margin-bottom: 50px;
`
export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 5px;
  & > :first-child {
    margin-bottom: 15px;
  }
`
