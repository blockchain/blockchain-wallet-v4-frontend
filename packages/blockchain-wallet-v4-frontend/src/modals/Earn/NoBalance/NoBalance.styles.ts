import styled from 'styled-components'

import { FlyoutWrapper } from 'components/Flyout'

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export const Top = styled(FlyoutWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 0;
  height: 100%;
`
export const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
`
export const IconContainer = styled.div`
  svg {
    cursor: pointer;
  }
`
export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 179px;
  width: 184px;
  position: relative;
`

export const VortexContainer = styled.div`
  position: absolute;
  left: 4px;
`
