import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Link } from 'blockchain-info-components'
import { actions } from 'data'

const MinimumFeeLink = props => (
  <Link
    size='12px'
    weight={400}
    onClick={props.actions.sendBtcFirstStepMinimumFeeClicked}
    data-e2e='btcMinimumFeeLink'
  >
    <FormattedMessage
      id='modals.sendbtc.minimumfeelink.minimum'
      defaultMessage='minimum'
    />
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MinimumFeeLink)
