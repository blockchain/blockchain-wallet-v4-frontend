import { SemanticColors } from '@blockchain-com/constellation'
import styled, { css } from 'styled-components'

import { Text } from 'blockchain-info-components'
import { GreyCartridge, SuccessCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'

export const HeaderWrapper = styled(FlyoutWrapper)`
  flex-direction: column;
  display: flex;
  max-width: 480px;
  background-color: ${(props) => props.theme.white};
  padding: 40px 40px 0 40px;
`
export const RowItemTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
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
  color: ${(props) => props.theme.grey600};
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
  color: ${(props) => props.theme.white};
`

export const RowItemSubTitleWhite = styled(RowItemSubTitle)`
  color: rgba(255, 255, 255, 0.72);
`

export const StatusCartridge = styled(GreyCartridge)`
  display: flex;
  flex-direction: row;
  > span {
    padding: 3px 8px;
  }
`
export const StatusCartridgeSuccess = styled(SuccessCartridge)`
  display: flex;
  flex-direction: row;
  background: ${SemanticColors.success};
  > span {
    padding: 3px 8px;
  }
`

export const UpgradeContainer = styled.div<{ second?: boolean }>`
  border: 1px solid ${(props) => props.theme.grey000};
  box-sizing: border-box;
  border-radius: 16px;
  margin: 16px 40px;
  ${(props) =>
    props.second &&
    css`
      border: 1px solid ${(props) => props.theme.blue400};
      background-color: ${(props) => props.theme.blue600};
    `}
`

export const Disclaimer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
`

export const UpgradeRow = styled.div`
  display: flex;
  padding: 16px 24px;
`
export const UpgradeRowWithBorder = styled(UpgradeRow)`
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`
export const UpgradeRowWithBlueBorder = styled(UpgradeRow)`
  border-bottom: 1px solid ${(props) => props.theme.blue400};
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
