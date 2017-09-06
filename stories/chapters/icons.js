import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { keysIn } from 'ramda'
import Layout from '../components/layout'
import { Icon as IconComponent } from '../../src'
import IcomoonMap from '../../src/Icons/Icomoon'

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
  border: 1px solid #CDCDCD;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`
const Icon = props => {
  const { name } = props

  return (
    <Container>
      <Sample>
        <IconComponent name={name} size='40px' />
      </Sample>
      <Code>{name}</Code>
    </Container>
  )
}

const IconLayout = props => {
  return (
    <IconWrapper>
      {props.children}
    </IconWrapper>
  )
}

const iconKeys = keysIn(IcomoonMap)

storiesOf('Icons', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('icomoon', () =>
    <IconLayout>
      { iconKeys.map((value, index) => {
        return <Icon key={index} name={value} />
      })}
    </IconLayout>)
