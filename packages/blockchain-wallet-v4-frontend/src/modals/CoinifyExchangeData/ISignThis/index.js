import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { path } from 'ramda'
import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

const ISXContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const ButtonContainer = styled.div`
  margin-left: 10%;
`

class ISignThisContainer extends Component {
  componentDidMount () {
    // console.log('isx mounted', this.props)
    window.addEventListener('message', function (e) {
    })

    const onComplete = (e) => {
      // console.log('V4 ISX_COMPONENT: from onComplete', e)
      // TODO dispatch action to go to next step --> order history and open modal for in review, rejected, processing, etc..
      this.props.coinifyActions.fromISX(e)
    }

    var e = document.getElementById('isx-iframe')
    const iSignThisDomain = path(['platforms', 'web', 'coinify', 'config', 'iSignThisDomain'], this.props.walletOptions.data)
    // const iSignThisID = this.props.iSignThisId

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
            // console.log('V4 ISX_COMPONENT complete')
            if (self.completeListener) {
              self.completeListener(d)
            }
          } else if (d.event.toLowerCase() === 'route') {
            // console.log('V4 ISX_COMPONENT route')
            if (self.routeListener) {
              self.routeListener(d)
            }
          } else if (d.event.toLowerCase() === 'error') {
            // console.log('V4 ISX_COMPONENT error')
            if (self.errorListener) {
              self.errorListener(d)
            }
          } else if (d.event.toLowerCase() === 'resized') {
            // console.log('V4 ISX_COMPONENT resized')
            if (self.resizeListener) {
              self.resizeListener(d)
            }
          }
        } catch (err) {
          // console.log('V4 ISX_COMPONENT: err caught:', err)
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
        // console.log('V4 ISX_COMPONENT: completed. e=', JSON.stringify(e))

        setState(e.state)
      })
      .fail(function (e) {
        // console.log('V4 ISX_COMPONENT: error. e=' + JSON.stringify(e))
      })
      .resized(function (e) {
        // console.log('V4 ISX_COMPONENT: resized. e=', JSON.stringify(e))
      })
      .route(function (e) {
        // console.log('V4 ISX_COMPONENT: route. e=' + JSON.stringify(e))
      })
      .publish()
  }

  render () {
    const { options, iSignThisId, coinifyActions } = this.props
    const walletOpts = options || this.props.walletOptions.data
    const iSignThisDomain = path(['platforms', 'web', 'coinify', 'config', 'iSignThisDomain'], walletOpts)
    const srcUrl = `${iSignThisDomain}/landing/${iSignThisId}?embed=true`

    return (
      <ISXContainer>
        <iframe style={{width: '65%', height: '400px'}}
          src={srcUrl}
          sandbox='allow-same-origin allow-scripts allow-forms'
          scrolling='yes'
          id='isx-iframe'
        />
        <ButtonContainer>
          <Button nature='empty-secondary' onClick={() => coinifyActions.coinifyNextCheckoutStep('checkout')}>
            <Text size='13px' weight={300}>
              <FormattedMessage id='cancel' defaultMessage='Cancel' />
            </Text>
          </Button>
        </ButtonContainer>
      </ISXContainer>
    )
  }
}

const mapStateToProps = (state) => ({
  walletOptions: path(['walletOptionsPath'], state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ISignThisContainer)
