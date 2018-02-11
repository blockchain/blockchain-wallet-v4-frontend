import styled from 'styled-components'
import { Color } from 'blockchain-info-components'

const SecurityHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: ${Color('gray-5')};
  width: 100%;

  & > * { margin-right: 10px; }
`

export default SecurityHeader
