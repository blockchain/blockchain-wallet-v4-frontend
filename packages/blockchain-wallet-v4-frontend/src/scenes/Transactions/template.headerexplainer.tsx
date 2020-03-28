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
const learnMore = coinModel => {
  return (
    <LearnMoreLink href={coinModel.learnMoreLink} target='_blank'>
      <LearnMoreText size='15px'>
        <FormattedMessage
          id='scenes.transaction.content.empty.getstarted.learnmore'
          defaultMessage='Learn More'
        />
      </LearnMoreText>
    </LearnMoreLink>
  )
}

export const getHeaderExplainer = coinModel => {
  switch (coinModel.coinTicker) {
    case 'BTC': {
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.btc'
            defaultMessage='Bitcoin (BTC) is the orginal crypto and the internet’s digital currency.'
          />
          {learnMore(coinModel)}
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
          {learnMore(coinModel)}
        </ExplainerText>
      )
    }
    case 'BCH': {
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.eth'
            defaultMessage='Bitcoin Cash (BTC) is a fork of Bitcoin built for everday transactions.'
          />
          {learnMore(coinModel)}
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
          {learnMore(coinModel)}
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
          {learnMore(coinModel)}
        </ExplainerText>
      )
    }
    default: {
      return <ExplainerText />
    }
  }
}
