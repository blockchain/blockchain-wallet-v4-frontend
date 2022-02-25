import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import moment from 'moment'

import { CoinChart, CoinChartComponent } from '.'
import { serie_ascending_1, serie_descending_1 } from './mocks'

const coinChartStory: ComponentMeta<CoinChartComponent> = {
  argTypes: {
    backgroundColor: {
      control: { type: 'color' },
      defaultValue: 'white'
    },
    data: {
      defaultValue: serie_ascending_1
    },
    primaryColor: {
      control: { type: 'color' },
      defaultValue: '#0C6CF2'
    },
    textColor: {
      control: { type: 'color' },
      defaultValue: '#98A1B2'
    },
    x: {
      defaultValue: 'date'
    },
    xFormatter: {
      control: {
        options: ['hourly'],
        type: 'select'
      },
      defaultValue: 'hourly',
      mapping: {
        hourly: (date) => moment(date).format('hh:mm')
      }
    },
    y: {
      defaultValue: 'value'
    }
  },
  component: CoinChart,
  title: 'Pages/CoinPage/CoinChart'
}

export const Ascending: ComponentStory<CoinChartComponent> = ({ ...args }) => (
  <div style={{ height: 300, width: 600 }}>
    <CoinChart {...args} />
  </div>
)

export const Decending: ComponentStory<CoinChartComponent> = ({ ...args }) => (
  <div style={{ height: 300, width: 600 }}>
    <CoinChart {...args} />
  </div>
)
Decending.args = {
  data: serie_descending_1
}

export const AscendingDark: ComponentStory<CoinChartComponent> = ({ ...args }) => (
  <div style={{ backgroundColor: '#2f2f2f', height: 300, width: 600 }}>
    <CoinChart {...args} />
  </div>
)
AscendingDark.args = {
  backgroundColor: '#353F52',
  primaryColor: '#0C6CF2',
  textColor: '#98a1b2'
}

export default coinChartStory
