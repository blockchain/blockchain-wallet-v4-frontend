import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const MinimumAmountLink = props => (
  <React.Fragment>
    <FormattedMessage
      id='modals.exchange.minimumamountlink.use'
      defaultMessage='Use'
    />
    &nbsp;
    <Link size='12px' weight={300} onClick={props.actions.useMin}>
      <FormattedMessage
        id='scenes.exchange.firststep.minimumamountlink.minimum'
        defaultMessage='minimum'
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
)(MinimumAmountLink)
