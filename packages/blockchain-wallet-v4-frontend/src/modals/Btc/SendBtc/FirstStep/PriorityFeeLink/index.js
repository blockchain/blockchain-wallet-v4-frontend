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
    onClick={props.actions.sendBtcFirstStepPriorityFeeClicked}
    data-e2e='btcPriorityFeeLink'
  >
    <FormattedMessage
      id='modals.sendbtc.priorityfeelink.priority'
      defaultMessage='Priority: {fee}'
      values={{ fee: props.fee }}
    />
  </Link>
)

PriorityFeeLink.propTypes = {
  fee: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(undefined, mapDispatchToProps)(PriorityFeeLink)
