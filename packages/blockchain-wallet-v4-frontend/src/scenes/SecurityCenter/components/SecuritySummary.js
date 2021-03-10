import styled from 'styled-components'

import { media } from 'services/styles'

const SecuritySummary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px 25px 0px 25px;
  box-sizing: border-box;
  ${media.mobile`
    padding: 15px 15px 0px 15px;
  `};
`

export default SecuritySummary
