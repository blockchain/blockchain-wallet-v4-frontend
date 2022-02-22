import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import CircleBackground from 'components/CircleBackground'

import { Box } from '../../model'

const ShadedBox = styled(Box)`
  margin-top: 16px;
  box-shadow: 0px 0px 12px rgba(5, 24, 61, 0.08);
  border: none;
  flex-direction: column;
`

const Header = styled.div`
  display: inline-flex;
  align-items: center;
`

const Body = styled.div`
  margin-top: 24px;
`

const Card = ({ children, description, number = 0, title }: Props) => (
  <ShadedBox>
    <Header>
      <CircleBackground>
        <Text size='20px' weight={600} color='blue600'>
          {number}
        </Text>
      </CircleBackground>
      <Text size='20px' weight={600} color='black'>
        {title}
      </Text>
    </Header>
    <Text size='12px' weight={500} color='grey700'>
      {description}
    </Text>
    <Body>{children}</Body>
  </ShadedBox>
)

type Props = {
  children: ReactElement
  description: ReactElement
  number: number
  title: ReactElement
}

export default Card
