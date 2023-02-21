import { PaletteColors } from '@blockchain-com/constellation'
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 0;
  height: 100%;
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
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;

  & > img {
    margin-bottom: 8px;
  }
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
  background-color: ${PaletteColors['grey-100']};
  border-radius: 8px;
  gap: 16px;
  margin: 28px 0 10px;

  & > a {
    width: fit-content;
  }
`
