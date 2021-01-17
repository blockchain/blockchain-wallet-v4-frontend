import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const REQUEST_FORM = 'requestCrypto'

export const StepHeader = styled(Text)<{
  marginBottom?: boolean
  spaceBetween?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: ${props =>
    props.spaceBetween ? 'space-between' : 'initial'};
  margin-bottom: ${props => (props.marginBottom ? '24px' : '0px')};
`

export const ClipboardWrapper = styled.div`
  margin-left: 18px;
  margin-top: 6px;
`
