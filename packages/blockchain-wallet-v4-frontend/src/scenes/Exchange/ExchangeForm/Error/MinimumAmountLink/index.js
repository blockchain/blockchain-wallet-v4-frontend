import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'blockchain-info-components'
import React from 'react'

const MinimumAmountLink = props => (
  <React.Fragment>
    <FormattedMessage
      id='modals.exchange.minimumamountlink.use'
      defaultMessage='Use'
    />
    &nbsp;
    <Link
      size='12px'
      weight={400}
      onClick={props.actions.useMin}
      data-e2e='exchangeUseMinLink'
    >
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

export default connect(undefined, mapDispatchToProps)(MinimumAmountLink)
