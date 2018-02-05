import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class FirstStep extends React.Component {
  componentWillMount () {
    this.props.sfoxDataActions.fetchQuote({amt: 1e8, baseCurr: 'BTC', quoteCurr: 'USD'})
  }

  render () {
    return (
      null
    )
  }
}

const mapDispatchToProps = dispatch => ({
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

export default connect(undefined, mapDispatchToProps)(FirstStep)
