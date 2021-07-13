import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const WarningWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: -6px;
  margin-bottom: 20px;
`
export const WarningLeftColumn = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  flex-basis: 75%;
`
export const WarningRightColumn = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-basis: 25%;
`
export const WarningHeader = styled(Text)`
  margin-bottom: 2px;
`
