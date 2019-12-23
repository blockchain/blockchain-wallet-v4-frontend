import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

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

export default connect(
  undefined,
  mapDispatchToProps
)(MinimumFeeLink)
