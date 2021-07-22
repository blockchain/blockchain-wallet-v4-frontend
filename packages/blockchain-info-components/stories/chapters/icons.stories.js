import { Icon, IconGlobalStyles } from '../../src'
import { keysIn } from 'ramda'
import { withInfo } from '@storybook/addon-info'
import IcomoonMap from '../../src/Icons/Icomoon'
import Layout from '../components/layout'
import React from 'react'
import styled from 'styled-components'
import { addDecorator } from '@storybook/react'

addDecorator(withInfo)

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
const IconComponent = (props) => {
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

const IconLayout = (props) => {
  return <IconWrapper>{props.children}</IconWrapper>
}

const iconKeys = keysIn(IcomoonMap)

export default {
  title: 'Icons',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [
    (story) => (
      <Layout>
        <>
          {story()}
          <IconGlobalStyles />
        </>
      </Layout>
    )
  ]
}

export const AllIconsIcomoon = () => (
  <IconLayout>
    {iconKeys.map((value, index) => {
      return <IconComponent key={index} name={value} size='40px' />
    })}
  </IconLayout>
)

AllIconsIcomoon.story = {
  name: 'All icons (icomoon)'
}

export const _Icon = () => <Icon name='mobile' />
export const IconWithSize = () => <Icon name='mobile' size='54px' />

IconWithSize.story = {
  name: 'Icon with size'
}

export const IconWithWeight = () => <Icon name='mobile' size='54px' weight={700} />

IconWithWeight.story = {
  name: 'Icon with weight'
}

export const IconWithColor = () => <Icon name='mobile' size='54px' color='blue900' />

IconWithColor.story = {
  name: 'Icon with color'
}

export const IconWithCursor = () => <Icon name='mobile' size='54px' color='blue900' cursor />

IconWithCursor.story = {
  name: 'Icon with cursor'
}
