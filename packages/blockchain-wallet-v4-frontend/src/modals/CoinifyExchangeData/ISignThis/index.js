import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { path } from 'ramda'
// import Template from './template'

class ISignThisContainer extends Component {
  componentDidMount () {
    console.log('isx mounted', this.props)
    window.addEventListener('message', function (e) {
      if (e.origin === 'http://localhost:8080') return
      console.log('addEventListener', e)
    })

    const onComplete = (e) => {
      console.log('from onComplete', e)
    }

    var e = document.getElementById('isx-iframe')
    const iSignThisDomain = path(['platforms', 'web', 'coinify', 'config', 'iSignThisDomain'], this.props.options)
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

      console.log('_isx setup')
      return this
    }

    _isx.done = function (_completeListener) {
      this.completeListener = _completeListener
      console.log('_isx done')
      return this
    }

    _isx.fail = function (_errorListener) {
      this.errorListener = _errorListener
      console.log('_isx fail')
      return this
    }

    _isx.route = function (_routeListener) {
      this.routeListener = _routeListener
      console.log('_isx route')
      return this
    }

    _isx.resized = function (_resizeListener) {
      this.resizeListener = _resizeListener
      console.log('_isx resized')
      return this
    }

    _isx.publish = function () {
      console.log('_isx publish')
      this.iframe = e

      // Create IE + others compatible event handler
      var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
      var eventer = window[eventMethod]
      var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'

      var self = this
      console.log('eventer', eventer, messageEvent)
      // Listen to message from child window
      eventer(messageEvent, function (e) {
        if (e.origin === 'http://localhost:8080') return
        console.log('eventer called', e)
        // Check for the domain who sent the messageEvent
        var origin = e.origin || e.originalEvent.origin
        if (origin !== iSignThisDomain) {
          // Event not generated from ISX, simply return
          return
        }

        var frame = document.getElementById('isx-iframe')
        if (e.source !== frame.contentWindow) {
          // Source of message isn't from the iframe
          return
        }

        try {
          var d = JSON.parse(e.data.split('[ISX-Embed]')[1])

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
          console.log('err caught:', err)
        }
      }, false)

      return this
    }
    var widget = {
      transaction_id: this.props.iSignThisId,
      container_id: 'isx-iframe'
    }

    var setState = (state) => {
      console.log('setState', state)
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
        console.log('completed. e=', JSON.stringify(e))

        setState(e.state)
      })
      .fail(function (e) {
        console.log('error. e=' + JSON.stringify(e))
      })
      .resized(function (e) {
        console.log('resized. e=', JSON.stringify(e))
      })
      .route(function (e) {
        console.log('route. e=' + JSON.stringify(e))
      })
      .publish()
  }

  render () {
    const { options, iSignThisId } = this.props
    const iSignThisDomain = path(['platforms', 'web', 'coinify', 'config', 'iSignThisDomain'], options)
    const srcUrl = `${iSignThisDomain}/landing/${iSignThisId}`

    return (
      <div>
        <p>iSignThis step</p>

        <iframe style={{width: '80%', height: '400px'}}
          src={srcUrl}
          sandbox='allow-same-origin allow-scripts allow-forms'
          scrolling='yes'
          id='isx-iframe'
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  hello: 'world'
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ISignThisContainer)
