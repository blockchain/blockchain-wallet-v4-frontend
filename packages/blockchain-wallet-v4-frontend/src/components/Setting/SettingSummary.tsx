import styled from 'styled-components'

import { media } from 'services/styles'

const SettingSummary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 0 10px 0;
  box-sizing: border-box;

  ${media.atLeastTabletL`
    width: 50%; 
  `}
`

export default SettingSummary
