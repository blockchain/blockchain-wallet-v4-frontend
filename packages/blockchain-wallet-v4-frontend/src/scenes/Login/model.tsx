import styled from 'styled-components'

import { Button, SpinningLoader, TextGroup } from 'blockchain-info-components'
import { FormLabel } from 'components/Form'
import { Wrapper } from 'components/Public'
import { media } from 'services/styles'

export const LoginWrapper = styled(Wrapper)`
  z-index: 1;
`
export const WrapperWithPadding = styled.div`
  padding: 0 32px;
  ${media.mobile`
    padding: 0 16px;
  `}
`
export const ActionButton = styled(Button)`
  margin-top: 15px;
`
export const Row = styled.div`
  display: flex;
`
export const CenterRow = styled.div`
  display: flex;
  justify-content: center;
`
export const CartridgeSentContainer = styled.div`
  width: auto;
`
export const GuidError = styled(TextGroup)`
  display: inline;
  margin-top: 3px;
`
export const LoginFormLabel = styled(FormLabel)`
  margin-bottom: 8px;
`
export const CircleBackground = styled.div<{ color?: string; size?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.size ? props.size : '40px')};
  height: ${(props) => (props.size ? props.size : '40px')};
  min-width: ${(props) => (props.size ? props.size : '40px')};
  background-color: ${(props) => (props.color ? props.theme[props.color] : props.theme.blue600)};
  border-radius: ${(props) => (props.size ? props.size : '40px')};
  margin-bottom: 8px;
`
export const RectangleBackground = styled.div`
  height: 48px;
  width: 100%;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 8px;
  margin-top: 24px;
`
export const HelpRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`
export const Column = styled.div`
  display: flex;
  flex-direction: column;
`
export const CenteredColumn = styled(Column)`
  align-items: center;
`
export const Loader = styled(SpinningLoader)`
  height: 75px;
  width: 75px;
  margin: 75px;
`
export const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
