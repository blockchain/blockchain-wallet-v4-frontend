import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { prop } from 'ramda'
import { Button, Text, TooltipHost, Icon } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

import renderFaq from 'components/FaqDropdown'
import CountdownTimer from 'components/Form/CountdownTimer'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import media from 'services/ResponsiveService'
import { getData } from './selectors'

const ISXContainer = styled.div`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`
const ButtonContainer = styled.div`
  margin-left: 5%;
  width: 20%;
  ${media.mobile`
    width: 100%;
    margin-left: 0%;
    margin-top: 20px;
  `};
`
const TimerContainer = styled.div`
  width: 66%;
  padding-bottom: 5px;
  display: flex;
  justify-content: flex-end;
`
const QuoteExpiredText = styled(Text)`
  span {
    margin-right: 5px;
  }
  span:first-of-type {
    font-style: italic;
  }
`
const IframeWrapper = styled.div`
  width: 65%;
  ${media.mobile`
    width: 100%;
  `};
`
const ISignThisIframe = styled.iframe`
  width: 100%;
  height: 400px;
  border: ${props => `1px solid ${props.theme['gray-1']}`};
`

const tradeQuestions = [
  {
    question: (
      <FormattedMessage
        id='scenes.coinify.isx.tradequestion'
        defaultMessage='How is my payment method used?'
      />
    ),
    answer: (
      <FormattedMessage
        id='scenes.coinify.isx.tradeanswer'
        defaultMessage="Bitcoin is delivered to your Blockchain wallet by using the information you've provided. With that in mind, please double check that your submitted details are error-free. If you pay by credit / debit card, your bitcoin will be delivered within a couple of hours after the transaction is completed, depending on your bank’s transfer policies. If you pay by bank transfer, your bitcoin will be delivered after Coinify has processed your order, which usually takes between 2-3 days."
      />
    )
  }
]
const getExpiredBtcValues = q =>
  q.quoteCurrency === 'BTC' ? `${q.quoteAmount / 1e8}` : `${q.baseAmount / 1e8}`
const getExpiredFiatValues = q =>
  q.baseCurrency !== 'BTC'
    ? `${Currency.formatFiat(Math.abs(q.baseAmount))} ${q.baseCurrency}`
    : `${Currency.formatFiat(Math.abs(q.quoteAmount))} ${q.quoteCurrency}`

class ISignThisContainer extends PureComponent {
  state = {
    quoteExpired: false
  }

  onQuoteExpiration = () => {
    this.setState({ quoteExpired: true })
  }

  render () {
    const { iSignThisId, coinifyActions, trade, quoteR } = this.props
    // NOTE: iSignThisId is now a payment URL for the new payment provider
    // see here: https://github.com/blockchain/bitcoin-coinify-client/pull/32/files#diff-a17a0bd50a25f6c13d0f93c7155ca029R144
    const srcUrl = iSignThisId

    return (
      <Fragment>
        <TimerContainer>
          {quoteR
            .map(quote => {
              if (this.state.quoteExpired) {
                return (
                  <Fragment>
                    <QuoteExpiredText size='11px' weight={300}>
                      <FormattedMessage
                        id='scenes.buysell.coinify.isx.quoteexpiredbtc'
                        defaultMessage='~{btcValue} BTC'
                        values={{ btcValue: getExpiredBtcValues(quote) }}
                      />
                      <FormattedMessage
                        id='scenes.buysell.coinify.isx.quoteexpiredfiat'
                        defaultMessage='({fiatValue})'
                        values={{ fiatValue: getExpiredFiatValues(quote) }}
                      />
                    </QuoteExpiredText>
                    <TooltipHost id='isx.expiredtooltip'>
                      <Icon name='question-in-circle' />
                    </TooltipHost>
                  </Fragment>
                )
              } else {
                return (
                  <CountdownTimer
                    expiryDate={trade
                      .map(prop('quoteExpireTime'))
                      .getOrElse(quote.expiresAt.getTime())}
                    handleExpiry={this.onQuoteExpiration}
                    tooltipExpiryTime='15 minutes'
                    hideTooltip
                  />
                )
              }
            })
            .getOrElse(null)}
        </TimerContainer>
        <ISXContainer>
          <IframeWrapper>
            <ISignThisIframe src={srcUrl} scrolling='yes' id='isx-iframe' />
          </IframeWrapper>
          <ButtonContainer>
            <Button
              nature='empty-secondary'
              fullwidth
              onClick={coinifyActions.cancelISX}
            >
              <Text size='13px' weight={300} color='brand-secondary'>
                <FormattedMessage
                  id='scenes.buysell.coinify.isx.finishlater'
                  defaultMessage='Finish later'
                />
              </Text>
            </Button>
            {renderFaq(tradeQuestions)}
          </ButtonContainer>
        </ISXContainer>
      </Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  coinifyActions: bindActionCreators(actions.components.coinify, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(ISignThisContainer)
