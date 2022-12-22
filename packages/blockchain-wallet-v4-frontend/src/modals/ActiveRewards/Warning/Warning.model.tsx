import { PaletteColors } from '@blockchain-com/constellation'
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
`
export const WarningContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: ${PaletteColors['grey-050']};
  border-radius: 8px;
  gap: 16px;
  margin: 28px 0 10px;

  & > a {
    width: fit-content;
  }
`
