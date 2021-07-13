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
    onClick={props.actions.sendEthFirstStepMinimumFeeClicked}
    data-e2e={`${props.coin}MinimumFeeLink`}
  >
    <FormattedMessage
      id='modals.sendeth.minimumfeelink.minimum'
      defaultMessage='minimum'
    />
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MinimumFeeLink)
