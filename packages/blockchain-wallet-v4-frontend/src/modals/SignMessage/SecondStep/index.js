import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// import { getData } from './selectors'
import { actions } from 'data'
import SecondStep from './template'

class SecondStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.resetForm = this.resetForm.bind(this)
  }

  resetForm (e) {
    this.props.previousStep()
  }

  render () {
    const { data, ...rest } = this.props
    return <SecondStep {...rest} {...data} resetForm={this.resetForm} />
  }
}

// const mapStateToProps = state => ({
//   data: getData(state)
// })

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(SecondStepContainer)
