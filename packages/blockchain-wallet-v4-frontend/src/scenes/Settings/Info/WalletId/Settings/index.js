import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import Settings from './template.js'

const SettingsContainer = props => {
  return <Settings guid={props.guid} />
}

const mapStateToProps = (state) => {
  return {
    guid: selectors.core.wallet.getGuid(state)
  }
}

export default connect(mapStateToProps)(SettingsContainer)
