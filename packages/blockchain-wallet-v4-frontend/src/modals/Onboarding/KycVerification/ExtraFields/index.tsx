import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Text } from 'blockchain-info-components'
import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics, ExtraKeyFieldsFormValuesType } from 'data/types'
import { useSardineContext } from 'hooks'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const { KYC_EXTRA_QUESTIONS_FORM } = model.components.identityVerification

const KYCExtraQuestionnaire = (props: Props) => {
  const [sardineContextIsReady, sardineContext] = useSardineContext('KYC')
  useEffect(() => {
    props.analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_ACCOUNT_INFO_SCREEN_VIEWED,
      properties: {}
    })
    if (sardineContextIsReady) {
      sardineContext.updateConfig({
        flow: 'KYC'
      })
    }
  }, [])

  const handleSubmit = () => {
    props.identityVerificationActions.saveKYCExtraQuestions()
    props.analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_ACCOUNT_INFO_SUBMITTED,
      properties: {}
    })
  }

  return props.data.cata({
    Failure: (error) => (
      <Text color='red600' size='14px' weight={400}>
        {error}
      </Text>
    ),
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => (
      <Success {...props} {...val} onSubmit={handleSubmit} onClose={props.onClose} />
    )
  })
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
  onClose: () => void
  onCompletionCallback?: () => void
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(KYCExtraQuestionnaire)
