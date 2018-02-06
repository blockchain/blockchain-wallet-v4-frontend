import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getBase, getData, getQuote } from './selectors'
import Success from './template.success'

class Checkout extends React.Component {
  componentWillMount () {
    this.props.sfoxDataActions.fetchProfile()
  }

  render () {
    const { data, quote, base } = this.props

    return data.cata({
      Success: (value) => <Success value={value} base={base} quote={quote} fetchQuote={this.props.sfoxDataActions.fetchQuote} />,
      Failure: (msg) => <div>{msg.error}</div>,
      Loading: () => <div>Loading...</div>,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  base: getBase(state),
  data: getData(state),
  quote: getQuote(state)
})

const mapDispatchToProps = dispatch => ({
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
