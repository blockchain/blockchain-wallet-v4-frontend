import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

export const ResultSubTitleWrapper = styled(Text)`
  font-size: 0.875rem;
  color: ${(props) => props.theme.grey600};
  font-weight: 500;
  margin-bottom: 24px;
`

export const ResultTitleWrapper = styled(Text)`
  font-size: 1.25rem;
  color: black;
  font-weight: 600;
  margin-bottom: 8px;
`

export const ResultWrapper = styled.div`
  width: 327px;
  text-align: center;
  margin-top: -10%;
`

export const StyledButton = styled(Button)`
  width: 327px;
  margin-bottom: 8px;
`
