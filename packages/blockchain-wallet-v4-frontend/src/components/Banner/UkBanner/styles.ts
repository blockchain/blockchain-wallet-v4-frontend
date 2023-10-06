import styled from 'styled-components'

import { Link } from 'blockchain-info-components'
import { media } from 'services/styles'

export const LinkContainer = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 4px 16px;
  background: ${({ theme }) => theme.grey000};
  color: ${({ theme }) => theme.grey600};
  margin-top: 1px;
  font-size: 12px;
  text-align: center;

  &:hover {
    color: ${({ theme }) => theme.grey600};
  }

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
