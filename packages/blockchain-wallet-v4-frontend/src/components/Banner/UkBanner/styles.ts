import styled from 'styled-components'

import { Link } from 'blockchain-info-components'

export const LinkContainer = styled(Link)`
  display: flex;
  width: 100%;
  padding: 4px 16px;
  background: ${({ theme }) => theme.grey000};
  margin-top: 1px;

  & > span {
    width: 100%;

    & > span {
      text-decoration: underline;
    }
  }

  &:hover {
    color: white !important;
  }
`
