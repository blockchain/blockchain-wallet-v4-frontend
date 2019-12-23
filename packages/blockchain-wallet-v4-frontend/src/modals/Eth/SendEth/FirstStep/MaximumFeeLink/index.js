import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const MaximumFeeLink = props => (
  <Link
    size='12px'
    weight={400}
    onClick={props.actions.sendEthFirstStepMaximumFeeClicked}
    data-e2e={`${props.coin}MaximumFeeLink`}
  >
    <FormattedMessage
      id='modals.sendeth.maximumfeelink.userecupperlimit'
      defaultMessage='Use our recommended upper limit.'
    />
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(MaximumFeeLink)
