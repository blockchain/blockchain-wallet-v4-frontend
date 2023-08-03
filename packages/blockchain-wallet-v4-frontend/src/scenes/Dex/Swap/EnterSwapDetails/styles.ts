import styled from 'styled-components'

import { QuoteError } from 'data/types'

export const ButtonContainer = styled.div<{ quoteError?: QuoteError }>`
  display: flex;
  flex-direction: column;
  gap: 24px;

  & > button {
    border-radius: 100px !important;

    &:first-child {
      ${({ quoteError, theme }) =>
        quoteError &&
        `background-color: ${theme.black} !important; color: ${theme.white} !important;`}
    }
  }
`
