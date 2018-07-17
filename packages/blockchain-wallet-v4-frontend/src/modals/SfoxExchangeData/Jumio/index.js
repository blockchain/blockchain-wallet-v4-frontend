import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'

import { getData } from './selectors'
import Success from './template.success'

class JumioContainer extends React.PureComponent {
  componentWillMount () {
    this.props.sfoxActions.getJumioToken()
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: value => <Success token={value.token} options={value.options} />,
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
  sfoxActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(JumioContainer)
