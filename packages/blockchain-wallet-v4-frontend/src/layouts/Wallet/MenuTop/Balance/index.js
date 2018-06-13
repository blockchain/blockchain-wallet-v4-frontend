import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Template from './template'

class Balance extends React.PureComponent {
  render () {
    const { data } = this.props
    return <Template btcUnspendableContext={data.btcUnspendableContext} bchUnspendableContext={data.bchUnspendableContext} path={data.path} />
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.kvStore.ethereum, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
