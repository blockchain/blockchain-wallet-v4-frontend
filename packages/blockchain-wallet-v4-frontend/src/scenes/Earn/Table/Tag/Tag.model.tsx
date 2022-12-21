import { SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { TagColorType } from './Tag.types'

export const TagContainer = styled.div<TagColorType>`
  background-color: ${({ backgroundColor }) => SemanticColors[backgroundColor]};
  border-radius: 4px;
  border: ${({ borderColor }) =>
    borderColor ? `1px solid ${SemanticColors[borderColor]}` : 'none'};
`
