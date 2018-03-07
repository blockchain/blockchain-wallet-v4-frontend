import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getCurrency, getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FiatAtTime extends React.Component {
  componentWillMount () {
    const { currency, amount, time, hash } = this.props
    this.props.actions.fetchFiatAtTime(hash, amount, time * 1000, currency)
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success currency={value.currency} fiatAtTime={value.fiatAtTime} type={this.props.type}/>,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading type={this.props.type}/>,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  currency: getCurrency(state),
  data: getData(state, ownProps.hash)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

FiatAtTime.propTypes = {
  amount: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FiatAtTime)
