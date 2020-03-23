import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class CoinDisplayContainer extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props
    return data.cata({
      Success: value => <Success {...rest}>{value}</Success>,
      Failure: message => <Error {...rest}>{message}</Error>,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

CoinDisplayContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.string.isRequired
}

CoinDisplayContainer.defaultProps = {
  children: 0
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(ownProps.coin, ownProps.children, ownProps.hideCoinTicker)
})

export default connect(mapStateToProps)(CoinDisplayContainer)
