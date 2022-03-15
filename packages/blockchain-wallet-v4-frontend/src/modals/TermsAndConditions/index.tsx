import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { RemoteDataType } from '@core/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import TermsAndConditionsContent from 'components/Flyout/TermsAndConditions'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import { getData } from './selectors'
import Loading from './template.loading'

class TermsAndConditions extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    this.props.termsAndConditionsActions.fetchTermsAndConditions()

    this.props.analyticsActions.trackEvent({
      key: Analytics.LOGIN_TERMS_AND_CONDITIONS_VIEWED,
      properties: {}
    })
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.termsAndConditionsActions.signTermsAndConditions()
    this.props.analyticsActions.trackEvent({
      key: Analytics.LOGIN_TERMS_AND_CONDITIONS_ACCEPTED,
      properties: {}
    })
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
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
          data-e2e='termsAndConditionsModal'
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
          data-e2e='termsAndConditionsModal'
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
          data-e2e='termsAndConditionsModal'
          userClickedOutside={false}
        >
          <TermsAndConditionsContent
            handleSubmit={this.handleSubmit}
            termsAndConditions={value.termsAndConditions}
          />
        </Flyout>
      )
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  termsAndConditionsActions: bindActionCreators(actions.components.termsAndConditions, dispatch)
})

export type SuccessStateType = ReturnType<typeof getData>['data']

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalName.TERMS_AND_CONDITIONS, { transition: duration }),
  connector
)

export type Props = ModalPropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(TermsAndConditions)
