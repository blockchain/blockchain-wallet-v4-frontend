import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import SiftScience from 'components/SiftScience'
import { actions } from 'data'

import Veriff from '../Veriff'
import { getData, getPreIdvData } from './selectors'
import Loading from './template.loading'

class VerifyContainer extends React.PureComponent<Props> {
  componentDidMount() {
    const { actions } = this.props
    actions.fetchSupportedDocuments()
    actions.checkKycFlow()
  }

  render() {
    const { actions, data, onClose, preIdvData } = this.props

    const VerificationFlow = data.cata({
      Failure: (message) => <DataError message={message} />,
      Loading: () => <Loading />,
      NotAsked: () => null,
      Success: () => {
        return <Veriff onClose={onClose} />
      }
    })

    const PreIdvCheck = preIdvData.cata({
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null,
      Success: (val) => <SiftScience {...val} onDone={actions.preIdvCheckFinished} />
    })

    return (
      <>
        {VerificationFlow}
        {PreIdvCheck}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  preIdvData: getPreIdvData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.identityVerification, dispatch),
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
