import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const LimitsUpdateLink = props => (
  <Link size='12px' weight={300} onClick={props.actions.updateLimits}>
    <FormattedMessage
      id='scenes.exchange.exchangeform.tryagain'
      defaultMessage='Try again'
    />
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(LimitsUpdateLink)
