import styled from 'styled-components'

import { media } from 'services/styles'

export const TextContainer = styled.div`
  min-width: 85px;

  ${media.laptop`
    min-width:60px;
  `}
`
