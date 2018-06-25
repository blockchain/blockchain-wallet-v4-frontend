import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Refresh from './template.js'

const RefreshContainer = props => (
  <Refresh handleRefresh={() => props.actions.refreshClicked()} />
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

export default connect(undefined, mapDispatchToProps)(RefreshContainer)
