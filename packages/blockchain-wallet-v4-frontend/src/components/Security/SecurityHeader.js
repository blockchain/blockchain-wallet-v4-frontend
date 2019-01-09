import styled from 'styled-components'
import media from 'services/ResponsiveService'
const SecurityHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;

  color: ${props => props.theme['gray-5']};
  width: 100%;
  font-size: 16px;
  & > * {
    margin-right: 10px;
  }
  ${media.mobile`
    font-size: 18px;
  `};
`

export default SecurityHeader
