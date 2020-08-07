import styled, { css } from 'styled-components'

import Content from './Content'
import DisplayContainer from './DisplayContainer'
import DisplayIcon from './DisplayIcon'
import DisplaySubTitle from './DisplaySubTitle'
import DisplayTitle from './DisplayTitle'
import MultiRowContainer from './MultiRowContainer'

export const DisplayPaymentIcon = styled(DisplayIcon)<{
  showBackground: boolean
}>`
  align-items: center;
  justify-content: center;
  ${props =>
    props.showBackground &&
    css`
      background-color: ${props => props.theme.blue000};
      width: 32px;
      height: 32px;
      border-radius: 50%;
    `}
`

export {
  DisplayIcon,
  DisplayContainer,
  Content,
  DisplayTitle,
  DisplaySubTitle,
  MultiRowContainer
}
