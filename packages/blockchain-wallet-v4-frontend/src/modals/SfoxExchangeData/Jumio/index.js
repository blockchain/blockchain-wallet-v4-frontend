import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { path } from 'ramda'
import { actions } from 'data'

import { getData } from './selectors'
import Success from './template.success'

class JumioContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onFinish = this.onFinish.bind(this)
  }

  componentDidMount () {
    this.props.sfoxActions.fetchJumioToken()

    let receiveMessage = e => {
      const jumioWhitelist = ['done']
      if (!e.data.command) return
      if (e.data.from !== 'jumio') return
      if (e.data.to !== 'exchange') return
      if (e.origin !== this.props.jumioBaseUrl) return
      if (jumioWhitelist.indexOf(e.data.command) < 0) return

      if (e.data.command === 'done') this.onFinish()
    }
    window.addEventListener('message', receiveMessage, false)
  }

  onFinish () {
    this.props.sfoxActions.completeJumio()
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
  data: getData(state),
  jumioBaseUrl: path(
    ['walletOptionsPath', 'data', 'domains', 'walletHelper'],
    state
  )
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
