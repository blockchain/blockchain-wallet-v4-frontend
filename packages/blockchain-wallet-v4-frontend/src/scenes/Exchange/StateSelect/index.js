import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import StateSelect from './template'
import { formValueSelector } from 'redux-form'
import { actions } from 'data'

import { contains } from 'ramda'

class StateSelectContainer extends React.PureComponent {
  constructor (props) {
    super()
    this.state = {}

    this.onHandleGoToStep = this.onHandleGoToStep.bind(this)
    this.onHandleNotify = this.onHandleNotify.bind(this)
  }

  componentWillMount () {
    this.props.formActions.initialize('stateSelect', this.props.initialValues)
  }

  componentWillReceiveProps (next) {
    this.setState({ allowed: contains(next.userState, this.props.stateWhitelist), email: next.userEmail })
  }

  onHandleGoToStep () {
    this.props.handleNextStep()
  }

  onHandleNotify () {
    // TODO send state name rather than abbreviation
    window.open(`https://docs.google.com/forms/d/e/1FAIpQLSd0r6NU82pQNka87iUkQJc3xZq6y0UHYHo09eZH-6SQZlTZrg/viewform?entry.1192956638=${this.props.userEmail}&entry.387129390=${this.props.userState}`)
  }

  render () {
    return <StateSelect
      allowState={this.state.allowed}
      handleGoToStep={this.onHandleGoToStep}
      handleNotify={this.onHandleNotify}
      handleSubmit={this.onHandleSubmit}
    />
  }
}

const mapStateToProps = (state) => ({
  initialValues: {
    userState: null,
    userEmail: ''
  },
  // TODO need to get this via wallet options
  stateWhitelist: ['AR', 'AZ', 'CA', 'CO', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'MI', 'MN', 'MO', 'MT', 'NE', 'NV', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'VA', 'WI', 'WV'],
  userState: formValueSelector('stateSelect')(state, 'userState'),
  userEmail: formValueSelector('stateSelect')(state, 'userEmail')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(StateSelectContainer)
