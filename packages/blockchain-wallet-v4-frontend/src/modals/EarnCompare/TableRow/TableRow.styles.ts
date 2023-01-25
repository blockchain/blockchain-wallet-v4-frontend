import { SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { media } from 'services/styles'

import { ContainerPropsType } from './TableRow.types'

export const Container = styled.div<ContainerPropsType>`
  border-bottom: ${({ hasBorder }) =>
    hasBorder && `1px solid ${SemanticColors['background-light']}`};

  & > div > div {
    width: 30%;

    &:first-child {
      min-width: 78px;
      width: 10%;
    }
  }

  button {
    ${media.tablet`
      padding: 32px 16px !important;
    `}
    ${media.mobile`
      padding: 24px 8px !important;
    `}
  }

  a:hover {
    text-decoration: none !important;
  }

  &:last-child {
    & > div > div > div {
      padding-bottom: 0 !important;
    }
  }
`
