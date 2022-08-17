import styled from 'styled-components'

import {
  DisplayContainer as BSDisplayContainer,
  DisplayIcon as BSDisplayIcon
} from 'components/BuySell'

export const DisplayContainer = styled(BSDisplayContainer)`
  flex-direction: row;
  align-items: flex-start;
`

export const DisplayIcon = styled(BSDisplayIcon)`
  min-height: 42px;
  align-items: center;
  flex-direction: row;
`
