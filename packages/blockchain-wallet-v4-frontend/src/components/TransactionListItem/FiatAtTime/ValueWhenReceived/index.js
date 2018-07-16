import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import NotAsked from './template.notasked'
import Success from './template.success'

class ValueWhenReceived extends React.PureComponent {
  render () {
    const { data, actions, amount, hash, time, currency } = this.props

    return data.cata({
      Success: (value) => <Success fiatAtTime={value} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <NotAsked
        handleClick={() => actions.fetchFiatAtTime(hash, amount, time * 1000, currency)}
      />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(ownProps.hash, ownProps.currency, state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

ValueWhenReceived.propTypes = {
  amount: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ValueWhenReceived)
