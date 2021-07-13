import styled from 'styled-components'

import { media } from 'services/styles'

export const Container = styled.div`
  display: flex;
  > div {
    margin-right: 24px;
    &:last-child {
      margin-right: 0px;
    }
  }
  ${media.laptop`
    flex-direction: column;
    align-items: start;
    > div {
      margin-right: 0;
      margin-bottom: 12px;
    }
  `};
`

export const Box = styled.div`
  position: relative;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.grey000};
  width: 280px;
`
