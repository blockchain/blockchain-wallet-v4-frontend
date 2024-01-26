import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const HeaderWrapper = styled(FlyoutWrapper)`
  height: unset;
  padding-bottom: 0px;
`

export const ContentWrapper = styled(FlyoutWrapper)`
  padding-top: 24px;
`

export const TopText = styled(Text)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
`

export const ProgressRow = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

export const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-left: 32px;
`

export const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.theme.grey000};
  backdrop-filter: blur(54.3656px);
  > span {
    justify-content: center;
  }
`

export const LinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 26px;
`
