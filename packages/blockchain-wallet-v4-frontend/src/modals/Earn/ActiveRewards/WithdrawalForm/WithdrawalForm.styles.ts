import { SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

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
export const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  gap: 16px;
`
export const MessageContainer = styled.div`
  background-color: ${SemanticColors['background-light']};
  border-radius: 8px;
`
