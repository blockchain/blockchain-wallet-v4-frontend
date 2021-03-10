import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.grey000};
  &:first-child {
    border-top: 1px solid ${props => props.theme.grey000};
  }
`

export const Title = styled(Text)`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.grey600};
`

export const Value = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${props =>
    props.color ? props.theme[props.color] : props.theme.grey800};
`
