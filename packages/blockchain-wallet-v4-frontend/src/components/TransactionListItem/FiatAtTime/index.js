import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import PropTypes from 'prop-types'
import React from 'react'
import Success from './template.success'

class FiatAtTime extends React.PureComponent {
  componentDidMount () {
    const { amount, hash, time, currency } = this.props
    this.props.actions.fetchFiatAtTime(hash, amount, time * 1000, currency)
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: value => <Success fiatAtTime={value} />,
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(ownProps.hash, ownProps.currency, state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.data.btc, dispatch)
})

FiatAtTime.propTypes = {
  amount: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiatAtTime)
