import styled from 'styled-components'
import { Color } from 'blockchain-info-components'

const SecurityHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: ${Color('gray-5')};
  width: 100%;
  @media(min-width: 480px) {
    font-size: 16px;
}

  & > * { margin-right: 10px; }
`

export default SecurityHeader
