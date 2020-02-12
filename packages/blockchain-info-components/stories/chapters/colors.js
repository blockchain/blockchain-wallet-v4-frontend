import { keysIn } from 'ramda'
import { Palette } from '../../src/Colors/index.ts'
import { storiesOf } from '@storybook/react'
import Layout from '../components/layout'
import React from 'react'
import styled from 'styled-components'

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
  border: 1px solid #cdcdcd;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`

const PaletteLayout = props => {
  const palette = Palette(props.theme)
  const keys = keysIn(palette)

  return (
    <ColorLayout>
      {keys.map(function (key, index) {
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
const ColorGridBody = styled.tbody``
const ColorGridRow = styled.tr`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #efefef;
  border-bottom: 1px ${props => (props.last ? 'solid' : 'none')} #efefef;
`
const ColorGridCell = styled.td`
  flex-basis: 20%;
  font-size: 18px;
  text-transform: uppercase;
  text-align: center;
  border-left: 1px solid #efefef;
  border-right: 1px ${props => (props.last ? 'solid' : 'none')} #efefef;
  background-color: ${props => (props.color ? props.color : 'white')};
  &:first-child {
    flex-basis: 40%;
  }
`

const PaletteGrid = props => {
  const themes = ['default', 'complement', 'grayscale', 'invert']
  const keys = keysIn(Palette('default'))

  return (
    <ColorGrid>
      <ColorGridBody>
        <ColorGridRow>
          <ColorGridCell>&nbsp;</ColorGridCell>
          {themes.map((theme, index) => (
            <ColorGridCell key={index} last={index === themes.length - 1}>
              {theme}
            </ColorGridCell>
          ))}
        </ColorGridRow>
        {keys.map((key, indexRow) => {
          return (
            <ColorGridRow key={indexRow} last={indexRow === keys.length - 1}>
              <ColorGridCell>{key}</ColorGridCell>
              {themes.map((theme, indexCell) => (
                <ColorGridCell
                  key={indexCell}
                  last={indexCell === themes.length - 1}
                  color={Palette(theme)[key]}
                >
                  &nbsp;
                </ColorGridCell>
              ))}
            </ColorGridRow>
          )
        })}
      </ColorGridBody>
    </ColorGrid>
  )
}

storiesOf('Colors', module)
  .addDecorator(story => <Layout>{story()}</Layout>)
  .add('All colors', () => <PaletteGrid />)
  .add('Theme Default', () => <PaletteLayout theme='default' />)
  .add('Theme Complement', () => <PaletteLayout theme='complement' />)
  .add('Theme Grayscale', () => <PaletteLayout theme='grayscale' />)
  .add('Theme Invert', () => <PaletteLayout theme='invert' />)
