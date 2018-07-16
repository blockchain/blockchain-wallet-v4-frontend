import styled from 'styled-components'
import media from 'services/ResponsiveService'

const SecurityContainer = styled.div`
  display: grid;
  grid-template-columns: 12% 73% 15%;
  border: 1px solid ${props => props.theme['gray-2']};
  border-radius: 4px;
  padding: 20px;
  @media (min-width: 320px) and (max-width: 991px) {
    display: block;
    width: auto;
  }
  ${media.mobile`
    padding: 0px;
  `};
`

export default SecurityContainer
