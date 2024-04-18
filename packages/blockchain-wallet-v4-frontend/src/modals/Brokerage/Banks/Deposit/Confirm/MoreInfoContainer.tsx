import { Padding, Button, Text } from '@blockchain-com/constellation'
import { FlyoutWrapper } from 'components/Flyout'
import React, { FC, ReactNode, useState } from 'react'
import styled from 'styled-components'

const Container = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  height: 100%;
  border-top: 1px solid ${(props) => props.theme.grey000};
`

export const MoreInfoContainer: FC<{ teaser: ReactNode; text: ReactNode }> = ({ teaser, text }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = (e) => {
    e.preventDefault()
    if (isOpen) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }
  return (
    <Container>
      <Padding bottom={1}>
        <Text as='p' variant='caption1'>
          {teaser}
        </Text>
      </Padding>
      {isOpen && (
        <Text as='p' variant='caption1'>
          {text}
        </Text>
      )}
      <Button
        as='button'
        onClick={handleClick}
        size='small'
        state='initial'
        text={isOpen ? 'Read Less' : 'Read More'}
        type='button'
        variant='minimal'
        width='auto'
      />
    </Container>
  )
}
