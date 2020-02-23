import { keysIn } from 'ramda'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import React from 'react'
import styled from 'styled-components'

import { Image } from '../../src'
import Images from '../../src/Images/Images'
import Layout from '../components/layout'

const ImageWrapper = styled.div`
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
  width: 250px;
  height: 300px;
  margin: 5px;
`
const Sample = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
`
const Code = styled.div`
  display: block;
  width: 100%;
  height: 50px;
  border: 1px solid #cdcdcd;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`
const ImageComponent = props => {
  const { name } = props

  return (
    <Container>
      <Sample>
        <Image name={name} width='100%' />
      </Sample>
      <Code>{name}</Code>
    </Container>
  )
}

const ImageLayout = props => {
  return <ImageWrapper>{props.children}</ImageWrapper>
}

const imageKeys = keysIn(Images)

storiesOf('Images', module)
  .addDecorator(story => <Layout>{story()}</Layout>)
  .addDecorator((story, context) =>
    withInfo({ text: 'Documentation', inline: true })(story)(context)
  )
  .add('All images', () => (
    <ImageLayout>
      {imageKeys.map((value, index) => {
        return <ImageComponent key={index} name={value} />
      })}
    </ImageLayout>
  ))
  .add('Image', () => <Image name='blockchain-logo' />)
  .add('Image width width', () => (
    <Image name='blockchain-logo' width='750px' />
  ))
  .add('Image width height', () => (
    <Image name='blockchain-logo' height='50px' />
  ))
