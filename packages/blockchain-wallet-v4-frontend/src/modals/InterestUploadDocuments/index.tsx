import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { FileUploadItem, RemoteDataType } from 'blockchain-wallet-v4/src/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { InterestUploadDocumentsStepType, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import AdditionalInformation from './AdditionalInformation'
import GetStarted from './GetStarted'
import { getData } from './selectors'
import Loading from './template.loading'
import UploadAndVerify from './UploadAndVerify'
import Uploaded from './Uploaded'

class InterestUploadDocumnets extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    this.props.interestUploadDocumentActions.fetchEDDDocumentsLimits()
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  handleSubmit = () => {
    // console.log('here we gooo')
  }

  submitData = (files: FileUploadItem[]) => {
    this.props.interestUploadDocumentActions.saveAdditionalData()
    this.props.interestUploadDocumentActions.uploadFiles({ files })
  }

  render() {
    const { data } = this.props
    return data.cata({
      Failure: () => null,
      Loading: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='interestUploadDocumentsModal'
        >
          <FlyoutChild>
            <Loading />
          </FlyoutChild>
        </Flyout>
      ),
      NotAsked: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='interestUploadDocumentsModal'
        >
          <FlyoutChild>
            <Loading />
          </FlyoutChild>
        </Flyout>
      ),
      Success: (value) => (
        <Flyout
          {...this.props}
          isOpen={this.state.show}
          onClose={this.handleClose}
          data-e2e='interestUploadDocumentsModal'
        >
          {value.step === InterestUploadDocumentsStepType.INIT_PAGE && (
            <FlyoutChild>
              <AdditionalInformation handleSubmit={this.handleSubmit} {...this.props} {...value} />
            </FlyoutChild>
          )}
          {value.step === InterestUploadDocumentsStepType.GET_STARTED && (
            <FlyoutChild>
              <GetStarted {...this.props} {...value} handleSubmit={this.handleSubmit} />
            </FlyoutChild>
          )}
          {value.step === InterestUploadDocumentsStepType.UPLOAD_AND_VERIFIED && (
            <FlyoutChild>
              <UploadAndVerify {...this.props} {...value} submitData={this.submitData} />
            </FlyoutChild>
          )}
          {value.step === InterestUploadDocumentsStepType.UPLOADED && (
            <FlyoutChild>
              <Uploaded {...this.props} handleSubmit={this.handleSubmit} />
            </FlyoutChild>
          )}
        </Flyout>
      )
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestUploadDocumentActions: bindActionCreators(
    actions.components.interestUploadDocument,
    dispatch
  )
})

export type SuccessStateType = ReturnType<typeof getData>['data']

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalName.INTEREST_UPLOAD_DOCUMENT_MODAL, { transition: duration }),
  connector
)

export type Props = ModalPropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(InterestUploadDocumnets)
