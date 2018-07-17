import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'

import { getData } from './selectors'
import Success from './template.success'

class JumioContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onFinish = this.onFinish.bind(this)
  }

  componentWillMount () {
    this.props.sfoxActions.getJumioToken()
  }

  onFinish () {
    const { data } = this.props
    const { accounts } = data.getOrElse({})
    accounts.length
      ? this.props.modalActions.closeModal()
      : this.props.sfoxActions.nextStep('funding')
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: value => (
        <Success
          token={value.token}
          options={value.options}
          onFinish={this.onFinish}
        />
      ),
      Loading: () => <div>Loading</div>,
      Failure: msg => <div>{msg}</div>,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sfoxActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(JumioContainer)
