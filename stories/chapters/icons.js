import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { keysIn, map } from 'ramda'
import Layout from '../components/layout'
import { Icon } from '../../src'
import IcomoonMap from '../../src/Icons/Icomoon'

const IconLayout = styled.div`
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

const iconKeys = keysIn(IcomoonMap)

storiesOf('Icons', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('icomoon', () =>
    <IconLayout>
      { map((value, index) => {
        return (
          <Container>
            <Sample>
              <Icon name={value} size='40px' />
            </Sample>
            <Code>{value}</Code>
          </Container>
        )
      }, iconKeys)}
    </IconLayout>
  )
