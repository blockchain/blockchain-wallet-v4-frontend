import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SemanticColors, Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Link } from 'blockchain-info-components'

import { FaqType } from './Faq.types'

export const faqs: FaqType[] = [
  {
    answer: (
      <FormattedMessage
        defaultMessage='You must have Full Access verification and live in a supported region to participate in Active Rewards. {link}.'
        id='scenes.earn.active-rewards-learn.faq.eligible.answer'
        values={{
          link: (
            <Text color={SemanticColors.primary} variant='paragraph1'>
              <Link
                href='https://support.blockchain.com/hc/en-us/articles/6868798964508-Who-is-eligible-for-Active-Rewards'
                size='14px'
                target='_blank'
              >
                <FormattedMessage
                  defaultMessage='Learn more about eligibility here'
                  id='scenes.earn.active-rewards-learn.faq.eligible.link'
                />
              </Link>
            </Text>
          )
        }}
      />
    ),
    id: 'scenes.earn.active-rewards-learn.faq.eligible.question',
    question: (
      <FormattedMessage
        defaultMessage='Who is eligible for Active Rewards?'
        id='scenes.earn.active-rewards-learn.faq.eligible.question'
      />
    )
  },
  {
    answer: (
      <FormattedMessage
        defaultMessage='Transfers can be made from both Trading Accounts and DeFi Wallets. Transferring your funds from a DeFi Wallet includes a network fee determined by the asset’s network. Funds you transfer during the week will be included in the following week’s strategy.'
        id='scenes.earn.active-rewards-learn.faq.transfer.answer'
      />
    ),
    id: 'scenes.earn.active-rewards-learn.faq.transfer.question',
    question: (
      <FormattedMessage
        defaultMessage='How do transfers work?'
        id='scenes.earn.active-rewards-learn.faq.transfer.question'
      />
    )
  },
  {
    answer: (
      <FormattedMessage
        defaultMessage='You can transfer as little as $1 to an Active Rewards Account to start earning.'
        id='scenes.earn.active-rewards-learn.faq.required.answer'
      />
    ),
    id: 'scenes.earn.active-rewards-learn.faq.required.question',
    question: (
      <FormattedMessage
        defaultMessage='What is the minimum amount required for Active Rewards?'
        id='scenes.earn.active-rewards-learn.faq.required.question'
      />
    )
  },
  {
    answer: (
      <FormattedMessage
        defaultMessage="{triggerPrice}: The price level that results in a debit to your balance if exceeded at expiration.{br}
        {subscribedAmount}: Your Active Rewards Account balance at the beginning of the strategy.{br}
        {expirationDate}: The time at which the strategy ends and payouts are calculated. This is Fridays at 08:00 AM (UTC) each week. The following week's strategy begins immediately after the expiration date."
        id='scenes.earn.active-rewards-learn.faq.meaning.answer'
        values={{
          br: <br />,
          expirationDate: (
            <strong>
              <FormattedMessage
                defaultMessage='Expiration date'
                id='scenes.earn.active-rewards-learn.faq.meaning.answer.expiration-date'
              />
            </strong>
          ),
          subscribedAmount: (
            <strong>
              <FormattedMessage
                defaultMessage='Subscribed amount'
                id='scenes.earn.active-rewards-learn.faq.meaning.answer.subscribed-amount'
              />
            </strong>
          ),
          triggerPrice: (
            <strong>
              <FormattedMessage
                defaultMessage='Trigger price'
                id='scenes.earn.active-rewards-learn.faq.meaning.answer.trigger-price'
              />
            </strong>
          )
        }}
      />
    ),
    id: 'scenes.earn.active-rewards-learn.faq.meaning.question',
    question: (
      <FormattedMessage
        defaultMessage='What do trigger price, subscription amount, and expiration date mean?'
        id='scenes.earn.active-rewards-learn.faq.meaning.question'
      />
    )
  },
  {
    answer: (
      <FormattedMessage
        defaultMessage='Every week at expiration, your payout is transferred to your Active Rewards Account.'
        id='scenes.earn.active-rewards-learn.faq.payout.answer'
      />
    ),
    id: 'scenes.earn.active-rewards-learn.faq.payout.question',
    question: (
      <FormattedMessage
        defaultMessage='How do payouts work?'
        id='scenes.earn.active-rewards-learn.faq.payout.question'
      />
    )
  },
  {
    answer: (
      <FormattedMessage
        defaultMessage='You can request a full withdrawal of your funds at any time. Your funds will be transferred to your Trading Account once the active strategy ends and rewards payouts are made.'
        id='scenes.earn.active-rewards-learn.faq.withdrawals.answer'
      />
    ),
    id: 'scenes.earn.active-rewards-learn.faq.withdrawals.question',
    question: (
      <FormattedMessage
        defaultMessage='How do withdrawals work?'
        id='scenes.earn.active-rewards-learn.faq.withdrawals.question'
      />
    )
  }
]

export const LinkContainer = styled.div`
  & > a {
    padding-left: 1rem !important;
  }
`
