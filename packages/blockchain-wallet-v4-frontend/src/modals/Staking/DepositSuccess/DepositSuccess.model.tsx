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
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 0;
`

export const Middle = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`
export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 8px;
  max-width: 340px;
`
export const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 16px;
`
