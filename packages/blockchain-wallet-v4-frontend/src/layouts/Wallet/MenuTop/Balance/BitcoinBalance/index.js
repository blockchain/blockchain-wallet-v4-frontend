import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class BitcoinBalance extends React.Component {
  componentWillMount () {
    this.props.actions.fetchData()
  }

  render () {
    const { bitcoinBalance } = this.props.data
    return <Success bitcoinBalance={bitcoinBalance} />
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BitcoinBalance)
