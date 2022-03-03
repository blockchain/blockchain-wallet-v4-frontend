import React, { CSSProperties, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { FlexComponent, FlexProps } from './types'

export const Flex: FlexComponent = styled.div<FlexProps>`
  ${({ alignItems, flexDirection, gap, justifyContent }) => css`
    align-items: ${alignItems};
    display: flex;
    flex-direction: ${flexDirection};
    gap: ${gap ? `${gap}px` : undefined};
    justify-content: ${justifyContent};
  `}
`
