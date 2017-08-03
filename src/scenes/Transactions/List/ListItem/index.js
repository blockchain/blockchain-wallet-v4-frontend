import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'

import { actions } from 'data'
import ListItem from './template.js'

const ListItemContainer = ({ ui, updateUI, ...props }) => {
  return (
    <ListItem
      toggled={ui.toggled}
      handleToggle={() => updateUI({ toggled: !ui.toggled })}
      handleClick={() => props.actions.toggleCoinDisplayed()}
      {...props}
    />
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions.preferences, dispatch)
  }
}

const enhance = compose(
  connect(undefined, mapDispatchToProps),
  ui({ state: { toggled: false } })
)

export default enhance(ListItemContainer)
