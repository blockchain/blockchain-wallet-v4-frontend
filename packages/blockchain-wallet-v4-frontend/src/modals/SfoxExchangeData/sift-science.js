import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import { path } from 'ramda'

class ISignThisContainer extends Component {
  constructor (props) {
    super(props)
    this.state = { enabled: false }
  }
  componentDidMount () {
    let receiveMessage = (e) => {
      const helperDomain = path(['domains', 'walletHelper'], this.propswalletOptions)
      if (!e.data.command) return
      if (e.data.from !== 'sift-science') return
      if (e.data.to !== 'exchange') return
      if (e.origin !== helperDomain) return
      switch (e.data.command) {
        case 'done':
          // Remove Sift Science iframe:
          this.props.sfoxFrontendActions.disableSiftScience()
          break
        default:
          return null
      }

    };
    window.addEventListener('message', receiveMessage, false)
  }

  render () {
    const { options, userId, siftScienceEnabled } = this.props
    const walletOptions = options || path(['data'], this.props.walletOptions)
    const helperDomain = path(['domains', 'walletHelper'], walletOptions)
    const sfoxSiftScience = path(['platforms', 'web', 'sfox', 'config', 'siftScience'], walletOptions)

    let url = `${helperDomain}/wallet-helper/sift-science/#/key/${sfoxSiftScience}/user/${userId}`
    // url += scope.tradeId ? `/trade/${scope.tradeId}` : '';

    if (userId) {
      return null
    }

    if (siftScienceEnabled) {
      return (
        <iframe
          src={url}
          sandbox='allow-same-origin allow-scripts'
          scrolling='no'
          id='sift-science-iframe'
        />
      )
    }
  }
}

const mapStateToProps = (state) => ({
  walletOptions: path(['walletOptionsPath'], state),
  userId: selectors.core.kvStore.buySell.getSfoxUser(state),
  siftScienceEnabled: path(['sfoxSignup', 'siftScienceEnabled'], state)
})

const mapDispatchToProps = (dispatch) => ({
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ISignThisContainer)
