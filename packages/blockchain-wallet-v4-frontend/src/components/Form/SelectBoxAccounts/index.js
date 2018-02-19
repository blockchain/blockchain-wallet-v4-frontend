import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Accounts from './Accounts'

class SelectBoxAccounts extends React.Component {
  render () {
    const { data, input, ...rest } = this.props

    return data.cata({
      Success: (value) => <Accounts {...value} {...input} {...rest} />,
      Failure: (message) => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

SelectBoxAccounts.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.shape({
      source: PropTypes.object,
      target: PropTypes.object
    })
  }),
  elements: PropTypes.array.isRequired,
  defaultSourceCoin: PropTypes.string.isRequired,
  defaultTargetCoin: PropTypes.string.isRequired
}

SelectBoxAccounts.defaultProps = {
  defaultSourceCoin: 'BTC',
  defaultTargetCoin: 'ETH'
}

export default connect(mapStateToProps)(SelectBoxAccounts)
