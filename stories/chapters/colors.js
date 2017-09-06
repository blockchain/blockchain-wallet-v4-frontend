import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'

import { keysIn } from 'ramda'
import Layout from '../components/layout'
import { Palette } from '../../src/Colors'

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
  height: 200px;
  margin: 5px;
`
const Sample = styled.div`
  display: block;
  width: 100%;
  height: 150px;
  background-color: ${props => props.bgColor};
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

const ColorGrid = styled.table`
  width: 100%;
  border-collapse: collapse;
`
const ColorGridRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const ColorGridCell = styled.div`
  flex-basis: 20%;
  font-size: 18px;
  text-transform: uppercase;
  text-align: center;
  border-width: 1px;
  border-color: black;
  border-top: solid;
  border-left: solid;
  border-bottom: ${props => props.last ? 'none' : 'solid'};
  border-right: ${props => props.last ? 'none' : 'solid'};
  background-color: ${props => props.color ? props.color : 'white'};
`

const PaletteGrid = props => {
  const themes = ['default', 'complement', 'grayscale', 'invert']
  const keys = keysIn(Palette('default'))

  return (
    <ColorGrid>
      <ColorGridRow>
        <ColorGridCell>&nbsp;</ColorGridCell>
        { themes.map((theme, index) => <ColorGridCell key={index}>{theme}</ColorGridCell>) }
      </ColorGridRow>
      { keys.map((key) => {
        return (
          <ColorGridRow>
            <ColorGridCell>{key}</ColorGridCell>
            {themes.map((theme, index) => <ColorGridCell key={index} last={index === themes.length} color={Palette(theme)[key]}>&nbsp;</ColorGridCell>) }
          </ColorGridRow>
        )
      })}
    </ColorGrid>
  )
}

storiesOf('Colors', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .add('All colors', () => <PaletteGrid />)
  .add('Default', () => <PaletteLayout theme='default' />)
  .add('Complement', () => <PaletteLayout theme='complement' />)
  .add('Grayscale', () => <PaletteLayout theme='grayscale' />)
  .add('Invert', () => <PaletteLayout theme='invert' />)
