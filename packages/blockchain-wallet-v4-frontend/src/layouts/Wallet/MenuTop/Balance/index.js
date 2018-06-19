import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Template from './template'

class Balance extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized()
  }
  render () {
    return <Template path={this.props.path} />
  }
}

const mapStateToProps = state => ({
  path: selectors.router.getPathname(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.balance, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
