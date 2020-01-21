import { Icon, IconGlobalStyles } from '../../src'
import { keysIn } from 'ramda'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import IcomoonMap from '../../src/Icons/Icomoon'
import Layout from '../components/layout'
import React from 'react'
import styled from 'styled-components'

const IconWrapper = styled.div`
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
const IconComponent = props => {
  const { name } = props

  return (
    <Container>
      <Sample>
        <Icon name={name} size='40px' />
      </Sample>
      <Code>{name}</Code>
    </Container>
  )
}

const IconLayout = props => {
  return <IconWrapper>{props.children}</IconWrapper>
}

const iconKeys = keysIn(IcomoonMap)

storiesOf('Icons', module)
  .addDecorator(story => (
    <Layout>
      <>
        {story()}
        <IconGlobalStyles />
      </>
    </Layout>
  ))
  .addDecorator((story, context) =>
    withInfo({ text: 'Documentation', inline: true })(story)(context)
  )
  .add('All icons (icomoon)', () => (
    <IconLayout>
      {iconKeys.map((value, index) => {
        return <IconComponent key={index} name={value} size='40px' />
      })}
    </IconLayout>
  ))
  .add('Icon', () => <Icon name='mobile' />)
  .add('Icon with size', () => <Icon name='mobile' size='54px' />)
  .add('Icon with weight', () => (
    <Icon name='mobile' size='54px' weight={700} />
  ))
  .add('Icon with color', () => (
    <Icon name='mobile' size='54px' color='blue900' />
  ))
  .add('Icon with cursor', () => (
    <Icon name='mobile' size='54px' color='blue900' cursor />
  ))
