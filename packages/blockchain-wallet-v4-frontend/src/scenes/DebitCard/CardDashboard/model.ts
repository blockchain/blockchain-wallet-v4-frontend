import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const BoxContainer = styled.div`
  border: 1px solid ${(props) => props.theme.grey000};
  box-sizing: border-box;
  border-radius: 16px;
  margin: 16px 40px;
  width: fit-content;
  display: inline-block;
  vertical-align: top;
`

export const BoxRow = styled.div`
  display: flex;
  padding: 16px 24px;
`

export const BoxRowWithBorder = styled(BoxRow)`
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`

export const BoxRowItemTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  padding-left: 16px;
  font-weight: 600;
  line-height: 150%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`
