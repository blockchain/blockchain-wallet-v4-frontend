import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Faq from './template.js'

const FaqContainer = ({ authActions }) => (
  <Faq handleFaqToggle={{}} />
)

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(undefined, mapDispatchToProps)(FaqContainer)
