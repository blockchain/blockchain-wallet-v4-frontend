import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Refresh from './template.js'

const RefreshContainer = ({ coreActions }) => (
  <Refresh handleRefresh={coreActions.refresh} />
)


const mapDispatchToProps = dispatch => ({
  coreActions: bindActionCreators(actions.core.refresh, dispatch)
})

export default connect(undefined, mapDispatchToProps)(RefreshContainer)
