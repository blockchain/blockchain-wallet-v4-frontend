import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { Button, Icon, Text, TooltipHost } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { path, prop } from 'ramda'
import React, { Fragment, PureComponent } from 'react'
import styled from 'styled-components'

import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { getData } from './selectors'
import CountdownTimer from 'components/Form/CountdownTimer'
import media from 'services/ResponsiveService'
import renderFaq from 'components/FaqDropdown'

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
  border: ${props => `1px solid ${props.theme.grey000}`};
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

  componentDidMount () {
    window.addEventListener('message', function (e) {})

    const onComplete = e => {
      // eslint-disable-next-line
      console.log(e)
      this.props.coinifyActions.fromISX(e)
    }

    var e = document.getElementById('isx-iframe')
    const iSignThisDomain = this.props.walletOptions
      .map(path(['platforms', 'web', 'coinify', 'config', 'iSignThisDomain']))
      .getOrElse(null)
    const coinifyPaymentDomain = this.props.walletOptions
      .map(path(['domains', 'coinifyPaymentDomain']))
      .getOrElse(null)

    var _isx = {
      transactionId: '',
      version: '1.0.0',
      configOptions: null
    }

    _isx.applyContainerStyles = function (c) {
      c.style['width'] = '100%'
      if (this.configOptions.height) {
        c.style['height'] = this.configOptions.height
      } else {
        c.style['height'] = '700px'
      }
      c.style['overflow'] = 'hidden'
    }

    _isx.setup = function (setup) {
      this.transactionId = setup.transaction_id
      this.configOptions = setup

      return this
    }

    _isx.done = function (_completeListener) {
      this.completeListener = _completeListener
      return this
    }

    _isx.fail = function (_errorListener) {
      this.errorListener = _errorListener
      return this
    }

    _isx.route = function (_routeListener) {
      this.routeListener = _routeListener
      return this
    }

    _isx.resized = function (_resizeListener) {
      this.resizeListener = _resizeListener
      return this
    }

    _isx.publish = function () {
      this.iframe = e
      // Create IE + others compatible event handler
      let eventMethod = window.addEventListener
        ? 'addEventListener'
        : 'attachEvent'
      let eventer = window[eventMethod]
      let messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'
      let self = this
      // Listen to message from child window
      eventer(
        messageEvent,
        function (e) {
          // Check for the domain who sent the messageEvent
          let origin = e.origin || e.originalEvent.origin
          // eslint-disable-next-line
          console.log(e)
          if (![iSignThisDomain, coinifyPaymentDomain].includes(origin)) {
            // Event not generated from ISX or coinifyPaymentDomain, simply return
            return
          }

          let frame = document.getElementById('isx-iframe')
          if (e.source !== prop('contentWindow', frame)) {
            // Source of message isn't from the iframe
            return
          }

          try {
            let d = JSON.parse(e.data.split('[ISX-Embed]')[1])
            // eslint-disable-next-line
            console.log(d)

            if (d.event.toLowerCase() === 'complete') {
              if (self.completeListener) {
                self.completeListener(d)
              }
            } else if (d.event.toLowerCase() === 'route') {
              if (self.routeListener) {
                self.routeListener(d)
              }
            } else if (d.event.toLowerCase() === 'error') {
              if (self.errorListener) {
                self.errorListener(d)
              }
            } else if (d.event.toLowerCase() === 'resized') {
              if (self.resizeListener) {
                self.resizeListener(d)
              }
            }
          } catch (err) {}
        },
        false
      )

      return this
    }
    var widget = {
      transaction_id: this.props.iSignThisId,
      container_id: 'isx-iframe'
    }

    var setState = state => {
      // console.log('V4 ISX_COMPONENT: setState', state)
      switch (state) {
        case 'SUCCESS':
          onComplete('processing')
          break
        case 'CANCELLED':
          onComplete('cancelled')
          break
        case 'EXPIRED':
          onComplete('expired')
          break
        case 'DECLINED':
        case 'FAILED':
        case 'REJECTED':
          onComplete('rejected')
          break
        case 'PENDING':
          onComplete('reviewing')
          break
      }
    }

    _isx
      .setup(widget)
      .done(function (e) {
        setState(e.state)
      })
      .fail(function (e) {})
      .resized(function (e) {})
      .route(function (e) {})
      .publish()
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
                    <QuoteExpiredText size='11px' weight={400}>
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
              <Text size='13px' weight={400} color='blue600'>
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
