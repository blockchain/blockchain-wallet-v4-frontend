import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const PriorityFeeLink = props => (
  <Link size='12px' weight={300} onClick={() => props.actions.sendBtcFirstStepPriorityFeeClicked()}>
    <FormattedMessage id='modals.sendbtc.priorityfeelink.priority' defaultMessage='Priority: {fee}' values={{ fee: props.fee }} />
  </Link>
)

PriorityFeeLink.propTypes = {
  fee: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(undefined, mapDispatchToProps)(PriorityFeeLink)
