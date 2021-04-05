import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import * as C from 'services/alerts'

import CopyClipboard from './template'

class CopyClipboardContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.timeout = undefined
    this.state = { active: false }
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  handleClick() {
    const { alertActions, coin, supportedCoins } = this.props
    this.setState({ active: true })
    this.timeout = setTimeout(() => {
      this.setState({ active: false })
    }, 2000)
    if (coin) {
      alertActions.displaySuccess(C.COPY_ADDRESS_CLIPBOARD_SUCCESS, {
        coinName: supportedCoins[coin].displayName
      })
    } else {
      alertActions.displaySuccess(C.COPY_LINK_CLIPBOARD_SUCCESS)
    }
  }

  render() {
    return (
      <CopyClipboard
        active={this.state.active}
        address={this.props.address}
        handleClick={this.handleClick}
        data-e2e={this.props['data-e2e']}
      />
    )
  }
}

CopyClipboardContainer.propTypes = {
  address: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CopyClipboardContainer)
