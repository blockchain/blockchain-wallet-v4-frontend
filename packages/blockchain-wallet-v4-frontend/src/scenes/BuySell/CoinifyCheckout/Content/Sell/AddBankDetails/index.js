import React from 'react'
import { connect } from 'react-redux'

import AddBankDetails from './template.js'

class AddBankDetailsContainer extends React.PureComponent {
  render () {
    return <AddBankDetails {...this.props} />
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(AddBankDetailsContainer)
