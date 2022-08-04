import styled, { css } from 'styled-components'

import { FlexComponent, FlexProps } from './types'

export const Flex: FlexComponent = styled.div<FlexProps>`
  ${({ alignItems, flexDirection, flexGrow, flexWrap, gap, justifyContent }) => css`
    align-items: ${alignItems};
    flex-wrap: ${flexWrap};
    flex-grow: ${flexGrow};
    display: flex;
    flex-direction: ${flexDirection};
    gap: ${gap ? `${gap}px` : undefined};
    justify-content: ${justifyContent};
  `}
`
