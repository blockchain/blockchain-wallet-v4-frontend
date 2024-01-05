import styled from 'styled-components'

import { Button, TextGroup } from 'blockchain-info-components'
import FormLabel from 'components/Form/FormLabel'
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
export const SoFiWrapperWithPadding = styled.div`
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
export const CenteredColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
export const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
