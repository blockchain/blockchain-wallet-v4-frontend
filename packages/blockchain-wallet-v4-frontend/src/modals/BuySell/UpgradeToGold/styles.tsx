import { PaletteColors } from '@blockchain-com/constellation'
import styled, { css } from 'styled-components'

import { Text } from 'blockchain-info-components'
import { BlueCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'

import { IconsContainer } from '../../components'

export const HeaderWrapper = styled(FlyoutWrapper)`
  flex-direction: column;
  display: flex;
  max-width: 480px;
  background-color: ${PaletteColors['white-000']};
  padding: 40px 40px 0 40px;
`
export const RowItemTitle = styled(Text)`
  color: ${PaletteColors['grey-900']};
  font-size: 16px;
  padding-left: 16px;
  font-weight: 600;
  line-height: 150%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`

export const RowItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const RowItemSubTitle = styled(Text)`
  color: ${PaletteColors['grey-600']};
  font-size: 14px;
  padding-left: 16px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`

export const RowItemTitleWhite = styled(RowItemTitle)`
  color: ${PaletteColors['white-000']};
`

export const RowItemSubTitleWhite = styled(RowItemSubTitle)`
  color: rgba(255, 255, 255, 0.72);
`
export const StatusCartridgeBlue = styled(BlueCartridge)`
  display: flex;
  flex-direction: row;
  background: rgba(255, 255, 255, 0.24);
  > span {
    padding: 3px 8px;
  }
`

export const UpgradeContainer = styled.div<{ second?: boolean }>`
  border: 1px solid ${PaletteColors['grey-000']};
  box-sizing: border-box;
  border-radius: 16px;
  margin: 16px 40px;
  ${(props) =>
    props.second &&
    css`
      border: 1px solid ${PaletteColors['blue-400']};
      background-color: ${PaletteColors['blue-600']};
    `}
`

export const Disclaimer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
`

export const UpgradeRowWithBlueBorder = styled.div`
  display: flex;
  padding: 16px 24px;
  border-bottom: 1px solid ${PaletteColors['blue-400']};
`

export const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${PaletteColors['grey-000']};
  backdrop-filter: blur(54.3656px);
  > span {
    justify-content: center;
  }
`

export const IconsContainerRight = styled(IconsContainer)`
  justify-content: space-between;
`
