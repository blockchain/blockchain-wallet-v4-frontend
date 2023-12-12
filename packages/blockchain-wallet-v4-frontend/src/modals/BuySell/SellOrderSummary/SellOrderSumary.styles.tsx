import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const DisclaimerText = styled(Text)`
  padding: 1rem 1.75rem;
  font-size: 14px;
  color: ${(props) => props.theme.grey600};
`

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
export const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const Amount = styled.div`
  margin-top: 40px;
  > div {
    display: inline;
  }
`
