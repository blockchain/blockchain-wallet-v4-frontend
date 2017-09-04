
import React from 'react'
import { connect } from 'react-redux'

// import { selectors } from 'data'
import SecondPassword from './template.js'

class SecondPasswordContainer extends React.Component {
  render () {
    return <SecondPassword {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  secondpasswordEnabled: 0 // selectors.core.wallet.getSecondpasswordEnabled to be created
})

export default connect(mapStateToProps)(SecondPasswordContainer)
