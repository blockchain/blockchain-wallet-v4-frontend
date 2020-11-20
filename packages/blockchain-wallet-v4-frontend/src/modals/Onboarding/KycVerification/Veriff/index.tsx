import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import Failure from './template.failure'
import Loading from '../Verify/template.loading'
import React from 'react'
import Success from './template.success'

class Veriff extends React.PureComponent<Props> {
  state = {
    loading: false
  }
  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.actions.fetchVeriffUrl()
    }
  }

  componentWillUnmount () {
    this.setState({ loading: false })
  }

  handleVeriffMessage = event => {
    if (event === 'FINISHED') {
      this.setState({ loading: true })
      this.props.actions.syncVeriff()
    }
    if (event === 'CANCELED') {
      this.props.onClose()
    }
  }

  render () {
    const { actions } = this.props

    if (this.state.loading) return <Loading />

    return this.props.data.cata({
      Success: val => (
        <Success
          url={val.veriffUrl}
          handleVeriffMessage={this.handleVeriffMessage}
        />
      ),
      Loading: () => <Loading />,
      Failure: message => (
        <Failure message={message} onClick={actions.fetchVeriffUrl} />
      ),
      NotAsked: () => <Loading />
    })
  }
}
const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.veriff, dispatch),
  kycActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  )
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>

export type OwnProps = ConnectedProps<typeof connector> & {
  onClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Veriff)
