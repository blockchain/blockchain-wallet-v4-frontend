import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
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
const ButtonComponent = props => {
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

const ButtonLayout = props => {
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

storiesOf('Buttons', module)
  .addDecorator(story => <Layout>{story()}</Layout>)
  .addDecorator((story, context) =>
    withInfo({ text: 'Documentation', inline: true })(story)(context)
  )
  .add('All buttons', () => (
    <ButtonLayout>
      {natures.map((value, index) => {
        return (
          <ButtonComponent
            key={index}
            nature={value}
          >{`Button ${value}`}</ButtonComponent>
        )
      })}
    </ButtonLayout>
  ))
  .add('Button', () => <Button>Button</Button>)
  .add('Button rounded', () => <Button rounded>Button rounded</Button>)
  .add('Button fullwidth', () => <Button fullwidth>Button fullwidth</Button>)
  .add('Button disabled', () => <Button disabled>Button disabled</Button>)
  .add('Button bold', () => <Button bold>Button bold</Button>)
  .add('Button uppercase', () => <Button uppercase>Button uppercase</Button>)
  .add('Button capitalize', () => (
    <Button capitalize>Button ca pi ta li ze</Button>
  ))
  .add('ButtonGroup with 2 buttons', () => (
    <ButtonGroup>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
    </ButtonGroup>
  ))
  .add('ButtonGroup with 3 buttons', () => (
    <ButtonGroup>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </ButtonGroup>
  ))
  .add('IconButton', () => <IconButton name='send' />)
  .add('IconButton with text', () => <IconButton name='send'>Send</IconButton>)
