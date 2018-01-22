import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class BalanceSummary extends React.Component {
  componentWillMount () {
    // this.props.bitcoinActions.fetchData()
  }

  render () {
    const { data } = this.props
    return <div />
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  bitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BalanceSummary)
