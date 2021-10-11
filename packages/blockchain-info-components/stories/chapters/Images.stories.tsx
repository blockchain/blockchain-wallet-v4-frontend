import React from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react/types-6-0'

import { keysIn } from 'ramda'
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


export const AllImages: Story<{}> = (args) => (
  <ImageLayout {...args} >
    {imageKeys.map((value, index) => {
      return <ImageComponent key={index} name={value} />
    })}
  </ImageLayout>
)


export const _Image = () => <Image name='blockchain-logo' />

// export const ImageWidthWidth = () => <Image name='blockchain-logo' width='750px' />

// ImageWidthWidth.story = {
//   name: 'Image width width'
// }

// export const ImageWidthHeight = () => <Image name='blockchain-logo' height='50px' />

// ImageWidthHeight.story = {
//   name: 'Image width height'
// }

export default {
    // argTypes: {
    //   mode: {
    //     options: ['close', 'back'],
    //     type: 'select'
    //   }
    // },
    // args: {
    //   'data-e2e': 'foooo',
    //   mode: 'back'
    // },
    component: AllImages,
    decorators: [
      (Story) => (
        <IntlProvider locale='en'>
          <Story />
        </IntlProvider>
      )
    ],
    title: 'Flyouts/Images'
  } as Meta