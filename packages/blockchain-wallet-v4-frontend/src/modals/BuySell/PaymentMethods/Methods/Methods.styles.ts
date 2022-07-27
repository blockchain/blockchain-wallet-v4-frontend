import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`

export const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 7px;
`

export const PaymentsWrapper = styled.div`
  border-top: 1px solid ${(props) => props.theme.grey000};
`

export const NoMethods = styled(FlyoutWrapper)`
  text-align: center;
`

export const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.blue000};
  display: flex;
  align-items: center;
  justify-content: center;
`
