import { FormattedMessage } from 'react-intl'
import { Link, Text } from 'blockchain-info-components'
import { SupportedCoinType, SupportedFiatType } from 'core/types'
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

export const getHeaderExplainer = (
  coinModel: SupportedCoinType | SupportedFiatType
) => {
  switch (coinModel.coinTicker) {
    case 'BTC': {
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.btc1'
            defaultMessage='Bitcoin (BTC) is the original crypto and the internet’s digital currency.'
          />
          <LearnMoreLink href={coinModel.learnMoreLink} target='_blank'>
            <LearnMoreText size='16px'>
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
          <LearnMoreLink href={coinModel.learnMoreLink} target='_blank'>
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
          <LearnMoreLink href={coinModel.learnMoreLink} target='_blank'>
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
          <LearnMoreLink href={coinModel.learnMoreLink} target='_blank'>
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
    case 'ALGO': {
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.algo'
            defaultMessage='Algorand (ALGO) is a public blockchain based on a pure proof-of-stake consensus protocol.'
          />
          <LearnMoreLink href={coinModel.learnMoreLink} target='_blank'>
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
    // @ts-ignore
    case 'USD-D': {
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.usdd'
            defaultMessage='The USD Digital coin (USD-D) is backed by the US Dollar, making it a Stablecoin.'
          />
          <LearnMoreLink
            href={(coinModel as SupportedCoinType).learnMoreLink}
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
    case 'USDT': {
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.usdt'
            defaultMessage='The Tether coin (USDT) is backed by the US Dollar, making it a Stablecoin.'
          />
          <LearnMoreLink href={coinModel.learnMoreLink} target='_blank'>
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
    case 'GBP':
    case 'EUR':
      return (
        <ExplainerText>
          <FormattedMessage
            id='scenes.transaction.headertext.explainer.fiat'
            defaultMessage='Store {currency} on your wallet and use it to Buy Crypto.'
            values={{
              currency: coinModel.displayName
            }}
          />
        </ExplainerText>
      )
    default: {
      return <ExplainerText />
    }
  }
}
