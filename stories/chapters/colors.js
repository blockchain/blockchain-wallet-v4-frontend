import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'

import { compose, map, zipObj, toPairs } from 'ramda'
import Layout from '../components/layout'
import { DefaultColor } from '../../src/Colors'

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

const PaletteDefault = () => {
  const convert = compose(map(zipObj(['key', 'value'])), toPairs)
  const colorsArray = convert(DefaultColor)

  return (
    <ColorLayout>
      { colorsArray.map(function (color, index) {
        console.log(color)
        return (
          <Container key={index}>
            <Sample bgColor={color.value} />
            <Code>{color.key}</Code>
          </Container>
        )
      })}
    </ColorLayout>
  )
}

storiesOf('Colors', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
    .add('Colors', () => <PaletteDefault />)
