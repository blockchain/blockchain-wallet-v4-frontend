import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const RegularFeeLink = props => (
  <Link size='12px' weight={300} onClick={() => props.actions.sendBtcFirstStepRegularFeeClicked()}>
    <FormattedMessage id='modals.sendbtc.regularfeelink.regular' defaultMessage='Reg: {fee},' values={{ fee: props.fee }} />
  </Link>
)

RegularFeeLink.propTypes = {
  fee: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(undefined, mapDispatchToProps)(RegularFeeLink)
