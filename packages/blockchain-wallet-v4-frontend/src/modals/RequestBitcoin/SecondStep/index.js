import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class SecondStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.state = { active: false }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({ active: true })
    this.timeout = setTimeout(() => { this.setState({ active: false }) }, 2000)
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success handleSubmit={this.handleSubmit} {...value} active={this.state.active} {...rest} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
