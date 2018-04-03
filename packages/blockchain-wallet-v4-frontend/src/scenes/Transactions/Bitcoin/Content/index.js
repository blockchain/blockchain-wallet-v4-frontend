import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { getData } from './selectors'
import { selectors, actions } from 'data'
import Content from './template'

const threshold = 250

class ContentContainer extends React.Component {
  componentWillMount () {
    this.props.dataBitcoinActions.fetchTransactions('', true)
  }

  componentWillReceiveProps (nextProps) {
    // Refresh the list if we change the source
    if (this.props.data.source !== nextProps.data.source) {
      this.props.dataBitcoinActions.fetchTransactions(nextProps.data.source, true)
    }

    // Appends more transactions depending on the scroll position
    if (!equals(this.props.scroll.yOffset, nextProps.scroll.yOffset)) {
      if (nextProps.scroll.yMax - nextProps.scroll.yOffset < threshold) {
        this.props.dataBitcoinActions.fetchTransactions(nextProps.data.source, false)
      }
    }
  }

  render () {
    return <Content {...this.props.data} />
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  scroll: selectors.scroll.selectScroll(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer)
