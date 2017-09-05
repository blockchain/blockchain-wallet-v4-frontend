import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import EmailAddress from './template.js'

class EmailAddressContainer extends React.Component {
  render () {
    return <EmailAddress {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  emailVerified: selectors.core.settings.getEmailVerified(state)
})

export default connect(mapStateToProps)(EmailAddressContainer)
