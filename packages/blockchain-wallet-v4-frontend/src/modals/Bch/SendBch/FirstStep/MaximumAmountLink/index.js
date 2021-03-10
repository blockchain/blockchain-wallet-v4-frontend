import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Link } from 'blockchain-info-components'
import { actions } from 'data'

const MaximumAmountLink = props => (
  <Link
    size='12px'
    weight={400}
    onClick={props.actions.sendBchFirstStepMaximumAmountClicked}
    data-e2e='bchMaximumAmountLink'
  >
    <FormattedMessage
      id='modals.sendbch.maximumamountlink.maximum'
      defaultMessage='maximum'
    />
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBch, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MaximumAmountLink)
