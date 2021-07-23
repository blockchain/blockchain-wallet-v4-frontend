import { keysIn } from 'ramda'
import { withInfo } from '@storybook/addon-info'
import React from 'react'
import styled from 'styled-components'
import { addDecorator } from '@storybook/react'

import { Image } from '../../src'
import Images from '../../src/Images/Images'
import Layout from '../components/layout'

addDecorator(withInfo)

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
const ImageComponent = (props) => {
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

const ImageLayout = (props) => {
  return <ImageWrapper>{props.children}</ImageWrapper>
}

const imageKeys = keysIn(Images)

export default {
  title: 'Images',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const AllImages = () => (
  <ImageLayout>
    {imageKeys.map((value, index) => {
      return <ImageComponent key={index} name={value} />
    })}
  </ImageLayout>
)

AllImages.story = {
  name: 'All images'
}

export const _Image = () => <Image name='blockchain-logo' />

export const ImageWidthWidth = () => <Image name='blockchain-logo' width='750px' />

ImageWidthWidth.story = {
  name: 'Image width width'
}

export const ImageWidthHeight = () => <Image name='blockchain-logo' height='50px' />

ImageWidthHeight.story = {
  name: 'Image width height'
}
