import React from 'react'
import styled, { css } from 'styled-components'

import { Text } from 'blockchain-info-components'

import { TagComponent, TagProps, TagVariant } from './Tag.types'

const Base = styled.div<TagProps>`
  ${({ theme, variant }) => {
    const backgroundColorRecord: Record<TagVariant, string> = {
      error: theme.red100,
      warning: theme.orange100
    }

    return css`
      background-color: ${backgroundColorRecord[variant]};
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      display: inline-block;
    `
  }}
`

export const Tag: TagComponent = ({ children, variant }) => {
  const colorRecord: Record<TagVariant, string> = {
    error: 'error',
    warning: 'orange600'
  }

  return (
    <Base variant={variant}>
      <Text size='12px' weight={600} color={colorRecord[variant]}>
        {children}
      </Text>
    </Base>
  )
}
