import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import ui from 'redux-ui'

class PaymentContainer extends Component {
  componentDidMount () {

  }

  render () {
    return <div>Payment Step</div>
  }
}

PaymentContainer.propTypes = {
  ui: PropTypes.object,
  updateUI: PropTypes.function,
  smsVerified: PropTypes.number.isRequired,
  emailVerified: PropTypes.number.isRequired
}

// const mapStateToProps = (state) => ({
//   hello: 'world'
// })
//
// const mapDispatchToProps = (dispatch) => ({
//   formActions: bindActionCreators(actions.form, dispatch)
// })
//
// const enhance = compose(
//   connect(mapStateToProps, mapDispatchToProps),
//   ui({ state: {} })
// )
//
// export default enhance(PaymentContainer)

export default PaymentContainer
