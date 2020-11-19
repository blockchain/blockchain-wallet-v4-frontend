import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import { checkHasWebcam } from 'utils/helpers'
import { getData, getPreIdvData } from './selectors'
import DataError from 'components/DataError'
import SiftScience from 'components/SiftScience'

import { ExtractSuccess } from 'core/types'
import Loading from './template.loading'
import Veriff from '../Veriff'

class VerifyContainer extends React.PureComponent<Props> {
  state = {
    hasWebcam: false
  }

  componentDidMount () {
    const { actions } = this.props
    actions.fetchSupportedDocuments()
    actions.checkKycFlow()
    checkHasWebcam().then(res => {
      this.setState({ hasWebcam: res })
    })
  }

  render () {
    const { actions, data, preIdvData, onClose } = this.props

    const VerificationFlow = data.cata({
      Success: () => <Veriff onClose={onClose} />,
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
  onBack: () => void
  onClose: () => void
}

export default connector(VerifyContainer) as React.ComponentType<{
  onBack: () => void
  onClose: () => void
}>
