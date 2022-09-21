import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const ResultSubTitleWrapper = styled(Text)`
  font-size: 0.875rem;
  color: ${(props) => props.theme.grey600};
  font-weight: 500;
  margin-bottom: 1.5rem;
`

export const ResultTitleWrapper = styled(Text)`
  font-size: 1.25rem;
  color: black;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

export const ResultWrapper = styled.div`
  padding: 0 2rem;
  text-align: center;
`
