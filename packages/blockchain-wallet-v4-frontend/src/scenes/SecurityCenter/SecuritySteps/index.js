import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { selectors } from 'data'

import SecuritySteps from './template.js'

class SecurityStepsContainer extends React.Component {
  render () {
    const { emailVerified } = this.props
    return (
      <SecuritySteps emailVerified={emailVerified} />
    )
  }
}

const mapStateToProps = (state) => ({
  emailVerified: selectors.core.settings.getEmailVerified(state)
})

const enhance = compose(
  connect(mapStateToProps, undefined)
)
export default enhance(SecurityStepsContainer)
