import styled from 'styled-components'

import { Link } from 'blockchain-info-components'
import { media } from 'services/styles'

export const LinkContainer = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 4px 16px;
  background: #0C6CF2;
  color: white;
  margin-top: 1px;
  font-size: 16px;
  text-align: center;

  & > span {
    width: 100%;

    & > span {
      text-decoration: underline;
    }
  }

  ${media.mobile`
    font-size: 10px;
  `}
`
