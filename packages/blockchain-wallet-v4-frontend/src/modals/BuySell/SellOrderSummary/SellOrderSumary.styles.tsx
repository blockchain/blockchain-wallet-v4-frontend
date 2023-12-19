import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

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
