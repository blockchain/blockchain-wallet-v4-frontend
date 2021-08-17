import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

export const StepHeader = styled(Text)<{
  marginBottom?: boolean
  spaceBetween?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.spaceBetween ? 'space-between' : 'initial')};
  margin-bottom: ${(props) => (props.marginBottom ? '24px' : '0px')};
`

export const AmountWrapper = styled(FlyoutWrapper)`
  padding-top: 0px;
`
