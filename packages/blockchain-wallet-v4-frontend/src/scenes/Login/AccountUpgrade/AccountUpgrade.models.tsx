import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'

export const Label = styled.div`
  background-color: ${(props) => props.theme.green000};
  color: ${(props) => props.theme.green600};
  text-transform: none;
  border-radius: 4px;
  width: fit-content;
  padding: 4px 6px;
  line-height: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
  margin-left: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

export const CenteredTitle = styled(Text)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Items = styled.div`
  margin-top: 20px;
`

export const Item = styled.div`
  padding: 20px 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  > span {
    margin-top: 4px;
  }
`

export const TierDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
`

export const TierTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
  margin-bottom: 8px;
`

export const ButtonNext = styled(Button)`
  margin-top: 20px;
`

export const ButtonLater = styled(Button)`
  margin-top: 24px;
  color: #0c6cf2;
`
export const StyledTemporaryButton = styled.button`
  margin: 20px 0 0;
`

export const BackArrow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const SubHeaderWrapper = styled.div`
  display: inline-flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`

export const TextToRightWrapper = styled.div`
  width: 100%;
  text-align: right;
`

export const CenteredMsgWrapper = styled(Text)`
  margin-top: 8px;
`

export const PanelButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 8px;
  padding: 24px 18px;
  margin: 24px 0 0;
  cursor: pointer;
  position: relative;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ButtonLine = styled(Icon)`
  align-items: center;
`
