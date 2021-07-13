import styled from 'styled-components'

import { media } from 'services/styles'

const SecurityContainer = styled.div`
  display: grid;
  grid-template-columns: 12% 73% 15%;
  border: 1px solid ${props => props.theme.grey200};
  border-radius: 4px;
  padding: 20px;
  ${media.tablet`
    display: block;
    width: auto;
  `}
  ${media.mobile`
    padding: 0px;
  `};
`

export default SecurityContainer
