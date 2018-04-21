import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const LinkNoMargin = styled(Link)`margin: 0;`

const MinimumFeeLink = props => (
  <LinkNoMargin size='12px' weight={300} onClick={() => props.actions.sendBtcFirstStepMinimumFeeClicked()}>
    <FormattedMessage id='modals.sendbtc.minimumfeelink.minimum' defaultMessage='minimum' />
  </LinkNoMargin>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MinimumFeeLink)