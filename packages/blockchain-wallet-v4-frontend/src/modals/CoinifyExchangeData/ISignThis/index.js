import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { equals, path, prop } from 'ramda'
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

const kycQuestions = [
  {
    question: (
      <FormattedMessage
        id='scenes.coinify.isx.kycquestion'
        defaultMessage='Why do you need this information?'
      />
    ),
    answer: (
      <FormattedMessage
        id='scenes.coinify.isx.kycanswer'
        defaultMessage='Government anti-money laundering regulations require this verification of identity. The purpose of fulfilling these regulations is to provide you with a secure, smooth, and customized experience.'
      />
    )
  }
]
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

class ISignThisContainer extends Component {
  constructor (props) {
    super(props)
    this.state = { quoteExpired: false }
    this.onQuoteExpiration = this.onQuoteExpiration.bind(this)
  }
  componentDidMount () {
    window.addEventListener('message', function (e) {})

    const onComplete = e => {
      this.props.coinifyActions.fromISX(e)
    }

    var e = document.getElementById('isx-iframe')
    const iSignThisDomain = this.props.walletOptions
      .map(path(['platforms', 'web', 'coinify', 'config', 'iSignThisDomain']))
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
          if (origin !== iSignThisDomain) {
            // Event not generated from ISX, simply return
            return
          }

          let frame = document.getElementById('isx-iframe')
          if (e.source !== prop('contentWindow', frame)) {
            // Source of message isn't from the iframe
            return
          }

          try {
            let d = JSON.parse(e.data.split('[ISX-Embed]')[1])

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

  onQuoteExpiration () {
    this.setState({ quoteExpired: true })
  }

  render () {
    const { options, iSignThisId, coinifyActions, trade, quoteR } = this.props
    const walletOpts = options || this.props.walletOptions.getOrElse(null)
    const iSignThisDomain = path(
      ['platforms', 'web', 'coinify', 'config', 'iSignThisDomain'],
      walletOpts
    )
    const srcUrl = `${iSignThisDomain}/landing/${iSignThisId}?embed=true`
    const isxType = path(['data', 'constructor', 'name'], trade)

    return (
      <Fragment>
        <TimerContainer>
          {quoteR
            .map(q => {
              if (isxType && isxType !== 'Trade') return null
              if (this.state.quoteExpired) {
                return (
                  <Fragment>
                    <QuoteExpiredText size='11px' weight={300}>
                      <FormattedMessage
                        id='scenes.buysell.coinify.isx.quoteexpiredbtc'
                        defaultMessage='~{btcValue} BTC'
                        values={{ btcValue: getExpiredBtcValues(q) }}
                      />
                      <FormattedMessage
                        id='scenes.buysell.coinify.isx.quoteexpiredfiat'
                        defaultMessage='({fiatValue})'
                        values={{ fiatValue: getExpiredFiatValues(q) }}
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
                      .getOrElse(q.expiresAt.getTime())}
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
              onClick={() => coinifyActions.cancelISX()}
            >
              <Text size='13px' weight={300} color='brand-secondary'>
                {equals(isxType, 'Trade') ? (
                  <FormattedMessage
                    id='scenes.buysell.coinify.isx.finishlater'
                    defaultMessage='Finish later'
                  />
                ) : (
                  <FormattedMessage
                    id='scenes.buysell.coinify.isx.dolater'
                    defaultMessage="I'll do this later"
                  />
                )}
              </Text>
            </Button>
            {equals(isxType, 'Trade')
              ? renderFaq(tradeQuestions)
              : renderFaq(kycQuestions)}
          </ButtonContainer>
        </ISXContainer>
      </Fragment>
    )
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ISignThisContainer)
