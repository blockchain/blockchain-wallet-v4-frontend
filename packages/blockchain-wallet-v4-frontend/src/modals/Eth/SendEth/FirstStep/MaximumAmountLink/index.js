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
    onClick={() =>
      props.actions.sendEthFirstStepMaximumAmountClicked(props.coin)
    }
    data-e2e={`${props.coin}MaximumAmountLink`}
  >
    <FormattedMessage
      id='modals.sendeth.maximumamountlink.maximum'
      defaultMessage='maximum'
    />
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MaximumAmountLink)
