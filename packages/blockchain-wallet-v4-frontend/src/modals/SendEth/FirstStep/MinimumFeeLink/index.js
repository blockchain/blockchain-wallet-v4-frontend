import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const MinimumFeeLink = props => (
  <Link
    size='12px'
    weight={300}
    onClick={() => props.actions.sendEthFirstStepMinimumFeeClicked()}
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

export default connect(
  undefined,
  mapDispatchToProps
)(MinimumFeeLink)
