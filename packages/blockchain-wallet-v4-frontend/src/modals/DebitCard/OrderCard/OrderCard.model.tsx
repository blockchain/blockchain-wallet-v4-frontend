import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const SubTextWrapper = styled(Text)`
  font-size: 1rem;
  font-weight: 500;
  color: ${(props) => props.theme.grey600};
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  text-align: center;
`

export const LoadingWrapper = styled.div`
  height: 100%;
`
