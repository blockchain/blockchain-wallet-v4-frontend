import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { keysIn } from 'ramda'

import Layout from '../components/layout'
import { Image as ImageComponent } from '../../src'
import Images from '../../src/Images/Images'

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
  border: 1px solid #CDCDCD;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`
const Image = props => {
  const { name, width } = props

  return (
    <Container>
      <Sample>
        <ImageComponent name={name} width={width} />
      </Sample>
      <Code>{name}</Code>
    </Container>
  )
}

const ImageLayout = props => {
  return (
    <ImageWrapper>
      {props.children}
    </ImageWrapper>
  )
}

const imageKeys = keysIn(Images)

storiesOf('Images', module)
    .addDecorator(story => (<Layout>{story()}</Layout>))
    .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
    .add('All images', () =>
      <ImageLayout>
        { imageKeys.map((value, index) => {
          return <Image key={index} name={value} width='100%' />
        })}
      </ImageLayout>)
    .add('App store badge', () => <Image name='app-store-badge' />)
    .add('Bitcoin network', () => <Image name='bitcoin-network' />)
    .add('Blockchain blue', () => <Image name='blockchain-blue' />)
    .add('Blockchain vector', () => <Image name='blockchain-vector' />)
    .add('Blue logo', () => <Image name='blue-logo' />)
    .add('Google play badge', () => <Image name='google-play-badge' />)
    .add('Landing page banner overlay', () => <Image name='landing-page-banner-overlay' />)
    .add('Landing page banner sm overlay', () => <Image name='landing-page-banner-sm-overlay' />)
    .add('QR code', () => <Image name='qr-code' />)
    .add('Refresh', () => <Image name='refresh' />)
    .add('Sophisticated', () => <Image name='sophisticated' />)
    .add('Blue logo with width', () => <Image name='blue-logo' width='100' />)
    .add('Blue logo with height', () => <Image name='blue-logo' height='50' />)
