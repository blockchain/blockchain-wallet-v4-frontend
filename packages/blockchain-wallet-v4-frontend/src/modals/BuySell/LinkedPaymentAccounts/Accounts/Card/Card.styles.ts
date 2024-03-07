import styled from 'styled-components'

import {
  DisplayContainer as BSDisplayContainer,
  DisplayIcon as BSDisplayIcon
} from 'components/BuySell'
import { Title, Value } from 'components/Flyout'

export const DisplayContainer = styled(BSDisplayContainer)`
  flex-direction: row;
  align-items: flex-start;
`

export const DisplayIcon = styled(BSDisplayIcon)`
  min-height: 42px;
  align-items: center;
  flex-direction: row;
`

export const StyledValue = styled(Value)`
  text-transform: capitalize;
`

export const StyledTitle = styled(Title)`
  color: ${(p) => p.theme.grey600};
  font-size: 14px;
  font-weight: 500;
`
