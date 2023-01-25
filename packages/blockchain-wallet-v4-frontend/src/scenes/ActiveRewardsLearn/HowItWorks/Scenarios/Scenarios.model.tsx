import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { ScenarioType } from '../HowItWorks.types'

export const scenarios: ScenarioType[] = [
  {
    description: (
      <FormattedMessage
        defaultMessage='You will receive your rewards for the week and be re-subscribed for the next week.'
        id='scenes.earn.active-rewards-learn.how-it-works.scenario1.description'
      />
    ),
    details: [
      [
        {
          title: (
            <FormattedMessage
              defaultMessage='Strategy details'
              id='scenes.earn.active-rewards-learn.details.strategy-details.title'
            />
          )
        },
        {
          subText: '$20,383',
          text: '1 BTC',
          title: (
            <FormattedMessage
              defaultMessage='Subscribed amount'
              id='scenes.earn.active-rewards-learn.details.subscribed-amount.title'
            />
          )
        },
        {
          text: '8.0%',
          title: (
            <FormattedMessage
              defaultMessage='Annual rate'
              id='scenes.earn.active-rewards-learn.details.annual-rate.title'
            />
          )
        },
        {
          text: '$22,000',
          title: (
            <FormattedMessage
              defaultMessage='Trigger price'
              id='scenes.earn.active-rewards-learn.details.trigger-price.title'
            />
          )
        }
      ],
      [
        {
          title: (
            <FormattedMessage
              defaultMessage="What you'd receive"
              id='scenes.earn.active-rewards-learn.details.receive.title'
            />
          )
        },
        {
          subText: '$18,000',
          text: '1 BTC',
          title: <FormattedMessage defaultMessage='Amount' id='copy.amount' />
        },
        {
          subText: '$26.58',
          text: '0.00147705 BTC',
          title: (
            <FormattedMessage
              defaultMessage='Weekly reward'
              id='scenes.earn.active-rewards-learn.details.weekly-reward.title'
            />
          )
        },
        {
          subText: '$18,026.58',
          text: '1.00147705 BTC',
          title: <FormattedMessage defaultMessage='Total' id='copy.total' />
        }
      ]
    ],
    id: 'scenes.earn.active-rewards-learn.how-it-works.scenario1.title',
    image: 'scenario-1-graph',
    title: (
      <FormattedMessage
        defaultMessage='Scenario 1 – Price of BTC is at or lower than trigger price'
        id='scenes.earn.active-rewards-learn.how-it-works.scenario1.title'
      />
    )
  },
  {
    description: (
      <FormattedMessage
        defaultMessage='You will receive your rewards for the week and be re-subscribed for the next week. Your Active Rewards Account will be debited based on the difference between the price of BTC and the trigger price, resulting in a reduction in your BTC balance.'
        id='scenes.earn.active-rewards-learn.how-it-works.scenario2.description'
      />
    ),
    details: [
      [
        {
          title: (
            <FormattedMessage
              defaultMessage='Strategy details'
              id='scenes.earn.active-rewards-learn.details.strategy-details.title'
            />
          )
        },
        {
          subText: '$20,383',
          text: '1 BTC',
          title: (
            <FormattedMessage
              defaultMessage='Subscribed amount'
              id='scenes.earn.active-rewards-learn.details.subscribed-amount.title'
            />
          )
        },
        {
          text: '8.0%',
          title: (
            <FormattedMessage
              defaultMessage='Annual rate'
              id='scenes.earn.active-rewards-learn.details.annual-rate.title'
            />
          )
        },
        {
          text: '$22,000',
          title: (
            <FormattedMessage
              defaultMessage='Trigger price'
              id='scenes.earn.active-rewards-learn.details.trigger-price.title'
            />
          )
        }
      ],
      [
        {
          title: (
            <FormattedMessage
              defaultMessage="What you'd receive"
              id='scenes.earn.active-rewards-learn.details.receive.title'
            />
          )
        },
        {
          subText: '$22,000',
          text: '0.88 BTC',
          title: <FormattedMessage defaultMessage='Amount' id='copy.amount' />
        },
        {
          subText: '$36.92',
          text: '0.00147705 BTC',
          title: (
            <FormattedMessage
              defaultMessage='Weekly reward'
              id='scenes.earn.active-rewards-learn.details.weekly-reward.title'
            />
          )
        },
        {
          subText: '$22,036.92',
          text: '0.88147705 BTC',
          title: <FormattedMessage defaultMessage='Total' id='copy.total' />
        }
      ]
    ],
    id: 'scenes.earn.active-rewards-learn.how-it-works.scenario2.title',
    image: 'scenario-2-graph',
    title: (
      <FormattedMessage
        defaultMessage='Scenario 2 – Price of BTC is higher than trigger price'
        id='scenes.earn.active-rewards-learn.how-it-works.scenario2.title'
      />
    )
  }
]

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
`
