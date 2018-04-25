import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

const LinkNoMargin = styled(Link)`margin: 0;`

const MaximumAmountLink = props => (
  <LinkNoMargin size='12px' weight={300} onClick={() => props.actions.sendBtcFirstStepMaximumAmountClicked()}>
    <FormattedMessage id='modals.sendbtc.maximumamountlink.maximum' defaultMessage='maximum' />
  </LinkNoMargin>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MaximumAmountLink)
