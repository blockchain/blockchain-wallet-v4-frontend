import React, { Component } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'
import Verify from './template'

class VerifyContainer extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
  }

  render () {
    return <Verify
      handleSubmit={this.handleSubmit}
    />
  }
}

const mapStateToProps = (state) => ({
  initialData: {
    hello: 'world'
  }
})

const mapDispatchToProps = (dispatch) => ({})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Verify', state: { updateToggled: false } })
)

export default enhance(VerifyContainer)
