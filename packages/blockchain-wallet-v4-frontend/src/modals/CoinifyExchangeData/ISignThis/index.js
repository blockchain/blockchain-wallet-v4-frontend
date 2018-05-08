import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'

class ISignThisContainer extends Component {
  componentDidMount () {
    window.addEventListener('message', function (e) {})
    const onComplete = () => {}
    const iSignThisDomain = 'https://verify.isignthis.com'
    // const e = document.getElementById('isx-iframe')
    // const iSignThisID = '6ae7fdad-4f3b-406a-9a59-f12c135c7709'

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
        } catch (e) {}
      }, false)

      return this
    }
    let widget = {
      transaction_id: '6ae7fdad-4f3b-406a-9a59-f12c135c7709',
      container_id: 'isx-iframe'
    }

    let setState = (state) => {
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

  render () {
    return (
      <div>
        <h3>iSignThis step</h3>
        <iframe style={{width: '80%', height: '400px'}}
          src="https://verify.isignthis.com/landing/6ae7fdad-4f3b-406a-9a59-f12c135c7709" // hardcode a trade
          sandbox='allow-same-origin allow-scripts allow-forms'
          scrolling='yes'
          id='isx-iframe'
        />
      </div>
    )
  }
}

const mapStateToProps = () => ({
  hello: 'world'
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ISignThisContainer)
