import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { selectors, actions } from 'data'
import ButtonAmount from './template.js'

const ButtonAmountContainer = (props) => {
  return (
    <ButtonAmount {...props} />
  )
}

const mapStateToProps = (state) => {
  return {
    coinDisplayed: selectors.preferences.getCoinDisplayed(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions.preferences, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonAmountContainer)
