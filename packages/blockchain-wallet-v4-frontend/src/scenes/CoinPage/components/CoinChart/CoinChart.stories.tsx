import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { format } from 'date-fns'

import { createCoinChartTooltipBuilder } from '../CoinChartTooltip'
import { CoinChart, CoinChartComponent } from '.'
import { liveDataCopy, serie_ascending_1, serie_descending_1 } from './mocks'

const coinChartStory: ComponentMeta<CoinChartComponent> = {
  argTypes: {
    backgroundColor: {
      control: { type: 'color' },
      defaultValue: 'white'
    },
    data: {
      defaultValue: serie_ascending_1
    },
    height: {
      defaultValue: 400
    },
    numTicks: {
      defaultValue: 6
    },
    primaryColor: {
      control: { type: 'color' },
      defaultValue: '#0C6CF2'
    },
    textColor: {
      control: { type: 'color' },
      defaultValue: '#98A1B2'
    },
    width: {
      defaultValue: 600
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
        hourly: (date) => format(new Date(date), 'hh:mm')
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
  <CoinChart tooltip={createCoinChartTooltipBuilder()} {...args} />
)

export const Decending: ComponentStory<CoinChartComponent> = ({ ...args }) => (
  <CoinChart tooltip={createCoinChartTooltipBuilder()} {...args} />
)
Decending.args = {
  data: serie_descending_1
}

export const AscendingDark: ComponentStory<CoinChartComponent> = ({ height, width, ...args }) => (
  <div style={{ backgroundColor: '#2f2f2f', height, width }}>
    <CoinChart width={width} height={height} tooltip={createCoinChartTooltipBuilder()} {...args} />
  </div>
)
AscendingDark.args = {
  backgroundColor: '#353F52',
  primaryColor: '#0C6CF2',
  textColor: '#98a1b2'
}

export const LiveCopy: ComponentStory<CoinChartComponent> = ({ ...args }) => {
  const data = liveDataCopy.map(([date, value]) => ({ date, value }))

  return (
    <div style={{ height: 300, width: 600 }}>
      <CoinChart
        {...args}
        data={data}
        x='date'
        y='value'
        xFormatter={(date) => format(new Date(date), 'hh:mm a')}
        tooltip={createCoinChartTooltipBuilder()}
      />
    </div>
  )
}

export default coinChartStory
