import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Link } from 'blockchain-info-components'
import { actions } from 'data'

const MinimumAmountLink = props => (
  <Link
    size='12px'
    weight={400}
    onClick={props.actions.sendBtcFirstStepMinimumAmountClicked}
    data-e2e='btcMinimumAmountLink'
  >
    <FormattedMessage
      id='modals.sendbtc.minimumamountlink.minimum'
      defaultMessage='minimum'
    />
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MinimumAmountLink)
