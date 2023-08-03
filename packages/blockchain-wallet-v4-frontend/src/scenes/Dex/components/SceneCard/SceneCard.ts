import styled from 'styled-components'

import { media } from 'services/styles'

export const SceneCard = styled.div<{ height?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 568px;
  height: ${({ height }) => height || 512}px;
  padding: 1.5rem;

  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.grey100};
  background-color: ${({ theme }) => theme.white};

  & button {
    border-radius: 32px !important;
  }

  ${media.tablet`
    width: 100%;
  `}
`
