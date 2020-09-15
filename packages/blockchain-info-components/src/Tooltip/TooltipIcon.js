import styled from 'styled-components'

import { Icon } from '../Icons'

const TooltipIcon = styled(Icon)`
  display: inline-flex;
  margin: 0px 5px;
  color: ${props => props.theme.grey400};
  font-size: ${props => (props.size ? props.size : '16px')};
`

export default TooltipIcon
