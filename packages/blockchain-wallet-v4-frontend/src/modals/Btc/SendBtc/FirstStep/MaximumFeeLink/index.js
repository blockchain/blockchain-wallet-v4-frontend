import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const MaximumFeeLink = props => (
  <Link
    size='12px'
    weight={300}
    onClick={props.actions.sendBtcFirstStepMaximumFeeClicked}
    data-e2e='btcMaximumFeeLink'
  >
    <FormattedMessage
      id='modals.sendbtc.maximumfeelink.userecupperlimit'
      defaultMessage='Use our recommended upper limit.'
    />
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(MaximumFeeLink)
