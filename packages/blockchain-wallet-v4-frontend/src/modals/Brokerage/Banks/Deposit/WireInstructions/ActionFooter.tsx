import React from 'react'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'

export const Wrapper = styled(Text)`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

type Props = {
  actions: { title: string; url: string }[]
  message: string
}

export const ActionFooter = (props: Props) => (
  <Wrapper size='12px' weight={500} color='grey600'>
    <span>{props.message}</span>
    {props.actions.map((action) => (
      <Link
        key={action.url}
        href={action.url}
        size='12px'
        weight={500}
        rel='noreferrer noopener'
        target='_blank'
      >
        {action.title}
      </Link>
    ))}
  </Wrapper>
)
