import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import modalEnhancer from 'providers/ModalEnhancer'
import PromptTemplate from './template.js'
import React from 'react'

class PromptContainer extends React.PureComponent {
  onSubmit = () => {
    this.props.actions.submitPromptInput(this.props.value)
  }

  render () {
    return (
      <PromptTemplate
        {...this.props}
        maxLength={this.props.maxLength}
        initialValues={{ value: this.props.initial }}
        onSubmit={this.onSubmit}
      />
    )
  }
}

const mapStateToProps = state => ({
  value: formValueSelector('promptInputModal')(state, 'value')
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.wallet, dispatch)
})

const enhance = compose(
  modalEnhancer('PromptInput'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(PromptContainer)
