import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import SiftScience from 'components/SiftScience'
import { actions } from 'data'
import { checkHasWebcam } from 'utils/helpers'

import Veriff from '../Veriff'
import { getData, getPreIdvData } from './selectors'
import Loading from './template.loading'

class VerifyContainer extends React.PureComponent<Props> {
  state = {
    hasWebcam: false
  }

  componentDidMount() {
    const { actions } = this.props
    actions.fetchSupportedDocuments()
    actions.checkKycFlow()
    checkHasWebcam().then(res => {
      this.setState({ hasWebcam: res })
    })
  }

  render() {
    const { actions, data, onClose, preIdvData } = this.props

    const VerificationFlow = data.cata({
      Success: () => {
        return <Veriff onClose={onClose} />
      },
      Loading: () => <Loading />,
      NotAsked: () => null,
      Failure: message => <DataError message={message} />
    })

    const PreIdvCheck = preIdvData.cata({
      Success: val => (
        <SiftScience {...val} onDone={actions.preIdvCheckFinished} />
      ),
      Loading: () => null,
      NotAsked: () => null,
      Failure: () => null
    })

    return (
      <>
        {VerificationFlow}
        {PreIdvCheck}
      </>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  preIdvData: getPreIdvData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

export type Props = ConnectedProps<typeof connector> & {
  onClose: () => void
}

export default connector(VerifyContainer) as React.ComponentType<{
  onClose: () => void
}>
