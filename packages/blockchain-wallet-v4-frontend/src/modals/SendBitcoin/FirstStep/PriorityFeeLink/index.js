import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const LinkNoMargin = styled(Link)`margin: 0;`

const PriorityFeeLink = props => (
  <LinkNoMargin size='12px' weight={300} onClick={() => props.actions.sendBtcFirstStepPriorityFeeClicked()}>
    <FormattedMessage id='modals.sendbtc.priorityfeelink.priority' defaultMessage='Priority: {fee}' values={{ fee: props.fee }} />
  </LinkNoMargin>
)

PriorityFeeLink.propTypes = {
  fee: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(undefined, mapDispatchToProps)(PriorityFeeLink)
