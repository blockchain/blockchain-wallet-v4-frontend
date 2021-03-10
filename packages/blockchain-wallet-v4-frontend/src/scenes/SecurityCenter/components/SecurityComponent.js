import styled from 'styled-components'

import { media } from 'services/styles'

const SecurityComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px 0 10px 0;
  box-sizing: border-box;

  ${media.atLeastTabletL`
    align-items: flex-end;
    width: 100%;
  `}
`

export default SecurityComponent
