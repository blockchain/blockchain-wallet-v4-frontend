import styled from 'styled-components'

import { DividerComponent } from './types'

export const Divider: DividerComponent = styled.div`
  padding: 0;
  margin: 0;
  border-top: 1px solid ${(props) => props.theme.grey000};
  display: block;
`
