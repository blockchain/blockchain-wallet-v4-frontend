import { FormattedMessage } from 'react-intl'
import { Link, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const ExplainerText = styled(Text)`
  margin-top: 15px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.grey600};
`
const LearnMoreLink = styled(Link)`
  display: inline-flex;
`
const LearnMoreText = styled(Text)`
  margin-left: 3px;
  size: 16px;
  font-weight: 500;
  color: ${props => props.theme.blue600};
`

export const getHeaderExplainer = coinModel => {
  switch (coinModel.coinTicker) {
    case 'BTC': {
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.btc1'
            defaultMessage='Bitcoin (BTC) is the original crypto and the internet’s digital currency.'
          />
          <LearnMoreLink
            href='https://www.blockchain.com/learning-portal/bitcoin-faq'
            target='_blank'
          >
            <LearnMoreText size='15px'>
              <FormattedMessage
                id='buttons.learn_more'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
          </LearnMoreLink>
        </ExplainerText>
      )
    }
    case 'ETH': {
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.eth'
            defaultMessage='Ethereum (ETH) is a currency and computing platform. Built for developers and apps.'
          />
          <LearnMoreLink
            href='https://support.blockchain.com/hc/en-us/sections/360000003163-Ethereum-FAQ'
            target='_blank'
          >
            <LearnMoreText size='15px'>
              <FormattedMessage
                id='buttons.learn_more'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
          </LearnMoreLink>
        </ExplainerText>
      )
    }
    case 'BCH': {
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.bch'
            defaultMessage='Bitcoin Cash (BCH) is a fork of Bitcoin built for everday transactions.'
          />
          <LearnMoreLink
            href='https://support.blockchain.com/hc/en-us/sections/115001633403-Bitcoin-Cash-FAQ'
            target='_blank'
          >
            <LearnMoreText size='15px'>
              <FormattedMessage
                id='buttons.learn_more'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
          </LearnMoreLink>
        </ExplainerText>
      )
    }
    case 'USD-D': {
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.usdd'
            defaultMessage='The USD Digital coin (USD-D) is backed by the US Dollar, making it a Stablecoin.'
          />
          <LearnMoreLink
            href='https://support.blockchain.com/hc/en-us/sections/360004368351-USD-Digital-previously-USD-PAX-FAQ'
            target='_blank'
          >
            <LearnMoreText size='15px'>
              <FormattedMessage
                id='buttons.learn_more'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
          </LearnMoreLink>
        </ExplainerText>
      )
    }
    case 'XLM': {
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.xlm'
            defaultMessage='The Stellar Lumen (XLM) connects banks, payments and you to the Stellar Payment network.'
          />
          <LearnMoreLink
            href='https://support.blockchain.com/hc/en-us/articles/360019105171-What-is-Stellar-'
            target='_blank'
          >
            <LearnMoreText size='15px'>
              <FormattedMessage
                id='buttons.learn_more'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
          </LearnMoreLink>
        </ExplainerText>
      )
    }
    default: {
      return <ExplainerText />
    }
  }
}
