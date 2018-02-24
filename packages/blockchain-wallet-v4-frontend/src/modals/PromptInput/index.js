import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import { formValueSelector } from 'redux-form'
import modalEnhancer from 'providers/ModalEnhancer'
import PromptTemplate from './template.js'

class PromptContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.actions.submitPromptInput(this.props.value)
  }

  render () {
    return (
      <PromptTemplate
        {...this.props}
        initialValues={{ value: this.props.initial }}
        onSubmit={this.onSubmit}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  value: formValueSelector('promptInputModal')(state, 'value')
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.wallet, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('PromptInput')
)

export default enhance(PromptContainer)
