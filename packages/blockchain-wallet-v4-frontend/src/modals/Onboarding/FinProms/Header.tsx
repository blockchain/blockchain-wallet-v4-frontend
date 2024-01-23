import React from 'react'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

const BackContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 40px;
  padding-bottom: 0;
`

type Props = {
  onClickBack?: () => void
  text: string
}

export const Header = ({ onClickBack, text }: Props) => (
  <BackContainer>
    {onClickBack && (
      <Icon
        cursor
        name='arrow-left'
        size='20px'
        color='grey600'
        style={{ marginRight: '1rem' }}
        role='button'
        onClick={onClickBack}
      />
    )}
    <Text size='16px' weight={600}>
      {text}
    </Text>
  </BackContainer>
)
