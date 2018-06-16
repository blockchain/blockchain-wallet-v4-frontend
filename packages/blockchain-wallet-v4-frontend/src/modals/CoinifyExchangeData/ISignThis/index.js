import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import { path } from 'ramda'
import { Button, Text, Tooltip } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import Helper from 'components/BuySell/FAQ'
import CountdownTimer from 'components/Form/CountdownTimer'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

const ISXContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const ButtonContainer = styled.div`
  margin-left: 5%;
  width: 20%;
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

const kycHelper = [
  {
    question: <FormattedMessage id='scenes.coinify.isx.question1' defaultMessage='Why do you need this information?' />,
    answer: <FormattedMessage id='scenes.coinify.isx.answer1' defaultMessage='Government anti-money laundering regulations require this verification of identity. The purpose of fulfilling these regulations is to provide you with a secure, smooth, and customized experience.' />
  }
]
const tradeHelper = [
  {
    question: <FormattedMessage id='scenes.coinify.isx.question2' defaultMessage='How is my payment method used?' />,
    answer: <FormattedMessage id='scenes.coinify.isx.answer2' defaultMessage="Bitcoin is delivered to your Blockchain wallet by using the information you' ve provided.With that in mind, please double check that your submitted details are error-free.If you pay by credit / debit card, your bitcoin will be delivered within a couple of hours after the transaction is completed, depending on your bank’s transfer policies.If you pay by bank transfer, your bitcoin will be delivered after Coinify has processed your order, which usually takes between 2-3 days." />
  }
]
const getExpiredBtcValues = (q) => q.quoteCurrency === 'BTC' ? `${q.quoteAmount / 1e8}` : `${q.baseAmount / 1e8}`
const getExpiredFiatValues = (q) => q.baseCurrency !== 'BTC' ? `${Currency.formatFiat(Math.abs(q.baseAmount))} ${q.baseCurrency}` : `${Currency.formatFiat(Math.abs(q.quoteAmount))} ${q.quoteCurrency}`
const kycFaqHelper = () => kycHelper.map((el, i) => <Helper key={i} question={el.question} answer={el.answer} />)
const tradeFaqHelper = () => tradeHelper.map((el, i) => <Helper key={i} question={el.question} answer={el.answer} />)

class ISignThisContainer extends Component {
  constructor (props) {
    super(props)
    this.state = { quoteExpired: false }
    this.onQuoteExpiration = this.onQuoteExpiration.bind(this)
  }
  componentDidMount () {
    window.addEventListener('message', function (e) {
    })

    const onComplete = (e) => {
      this.props.coinifyActions.fromISX(e)
    }

    var e = document.getElementById('isx-iframe')
    const iSignThisDomain = path(['platforms', 'web', 'coinify', 'config', 'iSignThisDomain'], this.props.walletOptions.data)

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
      let eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
      let eventer = window[eventMethod]
      let messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'
      let self = this
      // Listen to message from child window
      eventer(messageEvent, function (e) {
        // Check for the domain who sent the messageEvent
        let origin = e.origin || e.originalEvent.origin
        if (origin !== iSignThisDomain) {
          // Event not generated from ISX, simply return
          return
        }

        let frame = document.getElementById('isx-iframe')
        if (e.source !== frame.contentWindow) {
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
        } catch (err) {
        }
      }, false)

      return this
    }
    var widget = {
      transaction_id: this.props.iSignThisId,
      container_id: 'isx-iframe'
    }

    var setState = (state) => {
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
      .fail(function (e) {
      })
      .resized(function (e) {
      })
      .route(function (e) {
      })
      .publish()
  }

  onQuoteExpiration () {
    this.setState({ quoteExpired: true })
  }

  render () {
    const { options, iSignThisId, coinifyActions, trade, quoteR } = this.props
    const walletOpts = options || this.props.walletOptions.data
    const iSignThisDomain = path(['platforms', 'web', 'coinify', 'config', 'iSignThisDomain'], walletOpts)
    const srcUrl = `${iSignThisDomain}/landing/${iSignThisId}?embed=true`
    const isxType = path(['data', 'constructor', 'name'], trade)

    return (
      <Fragment>
        <TimerContainer>
          {quoteR.map((q) => {
            if (isxType && isxType !== 'Trade') return null
            if (this.state.quoteExpired) {
              return (
                <Fragment>
                  <QuoteExpiredText size='11px' weight={300}>
                    <FormattedMessage id='scenes.buysell.coinify.isx.quoteexpiredbtc' defaultMessage='~{btcValue} BTC' values={{ btcValue: getExpiredBtcValues(q) }} />
                    <FormattedMessage id='scenes.buysell.coinify.isx.quoteexpiredfiat' defaultMessage='({fiatValue})' values={{ fiatValue: getExpiredFiatValues(q) }} />
                  </QuoteExpiredText>
                  <Tooltip>
                    <FormattedMessage id='scenes.buysell.coinify.isx.expiredtooltip' defaultMessage='This is an estimated quote. The original quote for this trade expired. The exact amount of bitcoin received depends on when the payment is received.' />
                  </Tooltip>
                </Fragment>
              )
            } else {
              return (
                <CountdownTimer
                  expiryDate={q.expiresAt.getTime()}
                  handleExpiry={this.onQuoteExpiration}
                  tooltipExpiryTime='15 minutes'
                  hideTooltip
                />
              )
            }
          }).getOrElse(null)}
        </TimerContainer>
        <ISXContainer>
          <iframe style={{ width: '65%', height: '400px', border: '1px solid #EAEAEA' }}
            src={srcUrl}
            sandbox='allow-same-origin allow-scripts allow-forms'
            scrolling='yes'
            id='isx-iframe'
          />
          <ButtonContainer>
            <Button nature='empty-secondary' fullwidth onClick={() => coinifyActions.cancelISX()}>
              <Text size='13px' weight={300} color='brand-secondary'>
                {
                  isxType && isxType === 'Trade'
                    ? <FormattedMessage id='scenes.buysell.coinify.isx.finishlater' defaultMessage='Finish later' />
                    : <FormattedMessage id='scenes.buysell.coinify.isx.dolater' defaultMessage="I'll do this later" />
                }
              </Text>
            </Button>
            {
              isxType && isxType !== 'Trade'
                ? tradeFaqHelper()
                : kycFaqHelper()
            }
          </ButtonContainer>
        </ISXContainer>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  walletOptions: path(['walletOptionsPath'], state),
  quoteR: selectors.core.data.coinify.getQuote(state),
  trade: selectors.core.data.coinify.getTrade(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ISignThisContainer)
