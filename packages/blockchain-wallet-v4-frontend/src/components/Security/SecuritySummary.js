import styled from 'styled-components'
import Media from 'services/ResponsiveService'

const SecuritySummary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px 25px 0px 25px;
  box-sizing: border-box;
  ${Media.mobile`
    padding: 15px 15px 0px 15px;
  `};
`

export default SecuritySummary
