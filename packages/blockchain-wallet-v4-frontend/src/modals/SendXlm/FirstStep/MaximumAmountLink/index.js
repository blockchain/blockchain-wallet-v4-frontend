import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import { Link } from 'blockchain-info-components'

const MaximumAmountLink = props => (
  <Link
    size='12px'
    weight={300}
    onClick={props.actions.firstStepMaximumAmountClicked}
  >
    {`${props.effectiveBalance} XLM`}
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendXlm, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(MaximumAmountLink)
