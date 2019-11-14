import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

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

export default connect(
  undefined,
  mapDispatchToProps
)(MinimumAmountLink)
