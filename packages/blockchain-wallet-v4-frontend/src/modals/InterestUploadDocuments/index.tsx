import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { InterestUploadDocumentsStepType, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import AdditionalInformation from './AdditionalInformation'
import GetStarted from './GetStarted'
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

  render() {
    return (
      <Flyout {...this.props} isOpen={this.state.show} onClose={this.handleClose}>
        {this.props.step === InterestUploadDocumentsStepType.INIT_PAGE && (
          <FlyoutChild>
            <AdditionalInformation
              {...this.props}
              handleSubmit={this.handleSubmit}
              countryCode={this.props.countryCode}
            />
          </FlyoutChild>
        )}
        {this.props.step === InterestUploadDocumentsStepType.GET_STARTED && (
          <FlyoutChild>
            <GetStarted {...this.props} handleSubmit={this.handleSubmit} />
          </FlyoutChild>
        )}
        {this.props.step === InterestUploadDocumentsStepType.UPLOAD_AND_VERIFIED && (
          <FlyoutChild>
            <UploadAndVerify {...this.props} handleSubmit={this.handleSubmit} />
          </FlyoutChild>
        )}
        {this.props.step === InterestUploadDocumentsStepType.UPLOADED && (
          <FlyoutChild>
            <Uploaded {...this.props} handleSubmit={this.handleSubmit} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null),
  step: selectors.components.interestUploadDocument.getStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestUploadDocumentActions: bindActionCreators(
    actions.components.interestUploadDocument,
    dispatch
  )
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalName.INTEREST_UPLOAD_DOCUMENT_MODAL, { transition: duration }),
  connector
)

export type Props = ModalPropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(InterestUploadDocumnets)
