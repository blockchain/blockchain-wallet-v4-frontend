import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { RemoteData } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class CoinDisplayContainer extends React.Component {
  componentWillMount () {
    this.props.settingsActions.fetchSettings()
  }

  render () {
    const { data, ...rest } = this.props

    return RemoteData.caseOf(data.value, {
      Success: (value) => <Success {...rest}>{value}</Success>,
      Failed: (message) => <Error>{message}</Error>,
      _: () => <Loading />
    })
  }
}

CoinDisplayContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired
}

CoinDisplayContainer.defaultProps = {
  children: 0
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin, ownProps.children)
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinDisplayContainer)
