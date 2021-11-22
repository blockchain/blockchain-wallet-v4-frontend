import styled, { css } from 'styled-components'

import Content from './Content'
import DisplayContainer from './DisplayContainer'
import DisplayIcon from './DisplayIcon'
import DisplaySubTitle from './DisplaySubTitle'
import DisplayTitle from './DisplayTitle'
import MultiRowContainer from './MultiRowContainer'

const DisplayPaymentIcon = styled(DisplayIcon)<{
  showBackground: boolean
}>`
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.showBackground &&
    css`
      background-color: ${(props) => props.theme.blue000};
      width: 32px;
      height: 32px;
      border-radius: 50%;
    `}
`

export * from './Description'
export {
  Content,
  DisplayContainer,
  DisplayIcon,
  DisplayPaymentIcon,
  DisplaySubTitle,
  DisplayTitle,
  MultiRowContainer
}
