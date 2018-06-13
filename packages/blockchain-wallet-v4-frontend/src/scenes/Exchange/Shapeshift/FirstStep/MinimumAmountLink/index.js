import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const MinimumAmountLink = props => (
  <Link size='12px' weight={300} onClick={() => { if (!props.disabled) props.actions.firstStepMinimumClicked() }}>
    <FormattedMessage id='scenes.exchange.firststep.minimumamountlink.minimum' defaultMessage='minimum' />
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MinimumAmountLink)
