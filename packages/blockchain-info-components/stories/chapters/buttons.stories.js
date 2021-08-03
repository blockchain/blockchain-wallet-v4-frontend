import React from 'react'
import styled from 'styled-components'

import { Button, ButtonGroup, IconButton } from '../../src'
import Layout from '../components/layout'

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 175px;
  margin: 5px;
`
const Sample = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const Code = styled.div`
  display: block;
  width: 100%;
  height: 25px;
  border: 1px solid #cdcdcd;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`
const ButtonComponent = (props) => {
  const { nature, children } = props

  return (
    <Container>
      <Sample>
        <Button nature={nature}>{children}</Button>
      </Sample>
      <Code>{nature}</Code>
    </Container>
  )
}

const ButtonLayout = (props) => {
  return <ButtonWrapper>{props.children}</ButtonWrapper>
}

const natures = [
  'dark',
  'dark-grey',
  'empty',
  'empty-blue',
  'empty-secondary',
  'gray',
  'light',
  'light-red',
  'exchangeTurquoise',
  'primary',
  'purple',
  'secondary',
  'received',
  'sent',
  'success',
  'transferred',
  'warning',
  'white-transparent',
  'white-blue',
  'green'
]

export default {
  title: 'Buttons',
  parameters: {
    info: { text: 'Documentation', inline: true }
  }
}

export const AllButtons = () => (
  <ButtonLayout>
    {natures.map((value, index) => {
      return <ButtonComponent key={index} nature={value}>{`Button ${value}`}</ButtonComponent>
    })}
  </ButtonLayout>
)

AllButtons.story = {
  name: 'All buttons'
}

export const _Button = () => <Button>Button</Button>
export const ButtonRounded = () => <Button rounded>Button rounded</Button>

ButtonRounded.story = {
  name: 'Button rounded'
}

export const ButtonFullwidth = () => <Button fullwidth>Button fullwidth</Button>

ButtonFullwidth.story = {
  name: 'Button fullwidth'
}

export const ButtonDisabled = () => <Button disabled>Button disabled</Button>

ButtonDisabled.story = {
  name: 'Button disabled'
}

export const ButtonBold = () => <Button bold>Button bold</Button>

ButtonBold.story = {
  name: 'Button bold'
}

export const ButtonUppercase = () => <Button uppercase>Button uppercase</Button>

ButtonUppercase.story = {
  name: 'Button uppercase'
}

export const ButtonCapitalize = () => <Button capitalize>Button ca pi ta li ze</Button>

ButtonCapitalize.story = {
  name: 'Button capitalize'
}

export const ButtonGroupWith2Buttons = () => (
  <ButtonGroup>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
  </ButtonGroup>
)

ButtonGroupWith2Buttons.story = {
  name: 'ButtonGroup with 2 buttons'
}

export const ButtonGroupWith3Buttons = () => (
  <ButtonGroup>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </ButtonGroup>
)

ButtonGroupWith3Buttons.story = {
  name: 'ButtonGroup with 3 buttons'
}

export const _IconButton = () => <IconButton name='send' />

_IconButton.story = {
  name: 'IconButton'
}

export const IconButtonWithText = () => <IconButton name='send'>Send</IconButton>

IconButtonWithText.story = {
  name: 'IconButton with text'
}
