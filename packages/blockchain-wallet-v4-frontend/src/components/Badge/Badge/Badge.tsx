import styled, { css } from 'styled-components'

import { BaseBadge } from '../BaseBadge'

export const Badge = styled(BaseBadge)`
  ${({ size = 32 }) => css`
    padding: 0 ${size / 4}px;
  `}
`
