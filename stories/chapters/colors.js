import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'

import { compose, map, zipObj, toPairs, keysIn } from 'ramda'
import Layout from '../components/layout'
import { Palette } from '../../src/Colors'

console.log(Palette())

const ColorLayout = styled.div`
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
  display: block;
  width: 100%;
  height: 100%;
  background-color: ${props => props.bgColor};
`
const Code = styled.div`
  display: block;
  width: 100%;
  height: 25px;
  border: 1px solid #CDCDCD;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`

const PaletteLayout = (props) => {
  const palette = Palette(props.theme)
  const keys = keysIn(palette)

  return (
    <ColorLayout>
      { keys.map(function (key, index) {
        return (
          <Container key={index}>
            <Sample bgColor={palette[key]} />
            <Code>{key}</Code>
          </Container>
        )
      })}
    </ColorLayout>
  )
}

storiesOf('Colors', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .add('Default', () => <PaletteLayout theme='default' />)
  .add('Invert', () => <PaletteLayout theme='invert' />)
