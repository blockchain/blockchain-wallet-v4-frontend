import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { Text } from 'blockchain-info-components'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics, ExtraKeyFieldsFormValuesType, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'
import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const { KYC_EXTRA_QUESTIONS_FORM } = model.components.identityVerification

const KYCExtraQuestionnaire = (props: Props) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    props.identityVerificationActions.fetchExtraKYC()
    props.analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_ACCOUNT_INFO_SCREEN_VIEWED,
      properties: {}
    })
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      props.close()
    }, duration)
  }

  const handleSubmit = () => {
    props.identityVerificationActions.saveKYCExtraQuestions()
    props.analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_ACCOUNT_INFO_SUBMITTED,
      properties: {}
    })
  }

  return (
    <Flyout {...props} onClose={handleClose} isOpen={show} data-e2e='extraFieldsModal'>
      <FlyoutChild>
        {props.data.cata({
          Failure: (error) => (
            <Text color='red600' size='14px' weight={400}>
              {error}
            </Text>
          ),
          Loading: () => <Loading />,
          NotAsked: () => <Loading />,
          Success: (val) => <Success {...props} {...val} onSubmit={handleSubmit} />
        })}
      </FlyoutChild>
    </Flyout>
  )
}

const mapStateToProps = (state: RootState) => ({
  countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null),
  data: getData(state),
  formValues: selectors.form.getFormValues(KYC_EXTRA_QUESTIONS_FORM)(state) as
    | ExtraKeyFieldsFormValuesType
    | undefined
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  identityVerificationActions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  checkSddEligibility?: boolean
  onClose: () => void
  onCompletionCallback?: () => void
} & ModalPropsType

const enhance = compose(
  ModalEnhancer(ModalName.KYC_EXTRA_FIELDS_MODAL, { transition: duration }),
  connector
)

export type SuccessStateType = ReturnType<typeof getData>['data']

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(KYCExtraQuestionnaire)
