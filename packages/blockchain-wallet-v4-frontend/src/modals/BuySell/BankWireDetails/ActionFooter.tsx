import React from 'react'

import { Link } from 'blockchain-info-components'

import { Wrapper } from './ActionFooter.styles'

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
