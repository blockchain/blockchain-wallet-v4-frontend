import { Icon, Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button } from 'blockchain-info-components'

export const GreenLabel = styled.div`
  background-color: ${(props) => props.theme.green000};
  color: ${(props) => props.theme.green600};
  text-transform: none;
  border-radius: 0.25rem;
  width: fit-content;
  padding: 0.25rem 0.375rem;
  line-height: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
  margin-left: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

export const CenteredTitle = styled(Text)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`

export const CenteredDescription = styled(Text)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem;
`

export const CenteredContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 1.5rem;
`

export const Items = styled.div`
  margin-top: 0;
`

export const Item = styled.div`
  padding: 0 1rem 2rem 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  > span {
    margin-top: 0.25rem;
  }
`

export const TierDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.375rem 0 0 1.125rem;
`

export const HeadingIcon = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
`

export const TierTitle = styled(Text)`
  margin-bottom: 0.5rem;
`

export const ButtonNext = styled(Button)`
  margin-top: 1.25rem;
`

export const ButtonLater = styled(Button)`
  margin-top: 1.5rem;
  color: #0c6cf2;
`
export const StyledTemporaryButton = styled.button`
  margin: 1.25rem 0 0;
`

export const BackArrow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  > span {
    margin-left: 0.5rem;
  }
`

export const StyledBackArrowIcon = styled(Icon)`
  margin-right: 0.5rem;
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
  margin: 0.5rem 1.5rem 0;
`

export const PanelButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 0.5rem;
  padding: 1.5rem 1.125rem;
  margin: 1.5rem 0 0;
  cursor: pointer;
  position: relative;
  align-items: center;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0.5rem;
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

export const ButtonIcon = styled(Icon)`
  align-items: center;
  margin-right: 1rem;
`

export const ClipboardWrapper = styled.div`
  margin-bottom: 1.5rem;
  max-width: 90%;
`

export const StyledQRWrapper = styled.div`
  margin-bottom: 1.5rem;
`

export const BadgesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  a:not(:last-child) {
    margin-right: 1rem;
  }
`

export const Label = styled(Text)`
  display: inline-block;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`

export const InputWrapper = styled.div`
  margin-top: 1.5rem;
`

export const FootNote = styled(Text)`
  margin: 1.5rem 0;
  display: block;
`
