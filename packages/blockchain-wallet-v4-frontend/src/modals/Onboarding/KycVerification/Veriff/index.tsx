import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'

import Loading from '../Verify/template.loading'
import { getData } from './selectors'
import Failure from './template.failure'
import Success from './template.success'

class Veriff extends React.PureComponent<Props> {
  state = { loading: false }

  componentDidMount() {
    const { data } = this.props
    if (!Remote.Success.is(data)) {
      this.props.actions.fetchVeriffUrl()
    }
  }

  componentWillUnmount() {
    this.setState({ loading: false })
  }

  handleVeriffMessage = event => {
    if (event === 'FINISHED') {
      this.setState({ loading: true })
      this.props.actions.syncVeriff()
    }
    if (event === 'CANCELED') {
      this.props.onClose()
      this.props.kycActions.resetVerificationStep()
    }
  }

  render() {
    const { onClose } = this.props

    if (this.state.loading) return <Loading />

    return this.props.data.cata({
      Success: val => (
        <Success
          url={val.veriffUrl}
          handleVeriffMessage={this.handleVeriffMessage}
        />
      ),
      Loading: () => <Loading />,
      Failure: message => <Failure message={message} onClose={onClose} />,
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
