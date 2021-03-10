import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { Link } from 'blockchain-info-components'
import { actions } from 'data'

const RegularFeeLink = props => (
  <Link
    size='12px'
    weight={400}
    onClick={props.actions.sendEthFirstStepRegularFeeClicked}
    data-e2e={`${props.coin}RegularFeeLink`}
  >
    <FormattedMessage
      id='modals.sendeth.regularfeelink.regular'
      defaultMessage='Reg: {fee}, '
      values={{ fee: props.fee }}
    />
  </Link>
)

RegularFeeLink.propTypes = {
  fee: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch)
})

export default connect(undefined, mapDispatchToProps)(RegularFeeLink)
