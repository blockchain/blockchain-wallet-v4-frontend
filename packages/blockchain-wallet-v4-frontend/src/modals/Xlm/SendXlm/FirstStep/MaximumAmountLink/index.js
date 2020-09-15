import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import { Link } from 'blockchain-info-components'

const MaximumAmountLink = props => (
  <Link
    data-e2e='xlmMaximumAmountLink'
    size='12px'
    weight={400}
    onClick={props.actions.firstStepMaximumAmountClicked}
  >
    {`${props.effectiveBalance} XLM`}
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendXlm, dispatch)
})

export default connect(getData, mapDispatchToProps)(MaximumAmountLink)
