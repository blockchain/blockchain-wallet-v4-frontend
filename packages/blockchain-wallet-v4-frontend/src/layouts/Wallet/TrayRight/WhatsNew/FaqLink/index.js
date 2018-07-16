import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { Link } from 'blockchain-info-components'
import { actions } from 'data'

const FaqLink = props => (
  <Link size='13px' weight={300} onClick={() => props.actions.layoutWalletFaqClicked()}>
    <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.faqlink.learnmore' defaultMessage='Learn More' />
  </Link>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

export default connect(undefined, mapDispatchToProps)(FaqLink)
