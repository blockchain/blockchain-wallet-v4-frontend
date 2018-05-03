import styled from 'styled-components'
import { Color } from 'blockchain-info-components'

const SecurityDescription = styled.div`
  padding: 10px 0;
  font-family: 'Montserrat', sans-serif;
  font-weight: 200;
  font-size: 14px;
  color: ${Color('gray-5')};
  & > * { display: inline; margin-right: 5px; }
`

export default SecurityDescription
