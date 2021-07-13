import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { Link } from 'blockchain-info-components'
import { actions } from 'data'

const PriorityFeeLink = props => (
  <Link
    size='12px'
    weight={400}
    onClick={props.actions.sendEthFirstStepPriorityFeeClicked}
    data-e2e={`${props.coin}PriorityFeeLink`}
  >
    <FormattedMessage
      id='modals.sendeth.priorityfeelink.priority'
      defaultMessage='Priority: {fee}'
      values={{ fee: props.fee }}
    />
  </Link>
)

PriorityFeeLink.propTypes = {
  fee: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch)
})

export default connect(undefined, mapDispatchToProps)(PriorityFeeLink)
