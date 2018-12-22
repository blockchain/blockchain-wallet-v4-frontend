import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const MaximumAmountLink = props => (
  <React.Fragment>
    <FormattedMessage
      id='modals.exchange.maximumamountmessage.use'
      defaultMessage='Use'
    />
    &nbsp;
    <Link size='12px' weight={300} onClick={props.actions.useMax}>
      <FormattedMessage
        id='scenes.exchange.firststep.maximumamountlink.maximum'
        defaultMessage='maximum'
      />
    </Link>
  </React.Fragment>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(MaximumAmountLink)
