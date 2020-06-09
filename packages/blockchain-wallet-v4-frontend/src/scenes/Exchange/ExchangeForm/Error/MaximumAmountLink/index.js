import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'blockchain-info-components'
import React from 'react'

const MaximumAmountLink = props => (
  <React.Fragment>
    <FormattedMessage
      id='modals.exchange.maximumamountmessage.use'
      defaultMessage='Use'
    />
    &nbsp;
    <Link
      size='12px'
      weight={400}
      onClick={props.actions.useMax}
      data-e2e='exchangeUseMaxLink'
    >
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

export default connect(undefined, mapDispatchToProps)(MaximumAmountLink)
