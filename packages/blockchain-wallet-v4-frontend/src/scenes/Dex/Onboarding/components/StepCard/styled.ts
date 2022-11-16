import styled from 'styled-components'

import { media } from 'services/styles'

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 568px;
  height: 512px;
  padding: 1.5rem;

  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.grey100};
  background-color: ${({ theme }) => theme.white};

  ${media.tablet`
    width: 100%;
  `}

  ${media.mobile`
    padding: 20px;
  `}
`
