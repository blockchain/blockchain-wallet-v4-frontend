import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import DataError from 'components/DataError'
import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics, InfoAndResidentialFormValuesType } from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './UserInfoDetails.template'

const { USER_INFO_DETAILS } = model.components.identityVerification

const UserInfoDetails = (props: Props) => {
  useEffect(() => {
    if (props.hasCowboysTag) {
      props.analyticsActions.trackEvent({
        key: Analytics.COWBOYS_PERSONAL_INFO_VIEWED,
        properties: {}
      })
      props.analyticsActions.trackEvent({
        key: Analytics.COWBOYS_ADDRESS_VIEWED,
        properties: {}
      })
    }
  }, [])

  const handleSubmit = () => {
    const { analyticsActions, identityVerificationActions } = props
    identityVerificationActions.saveUserInfoData()
    analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_PERSONAL_INFORMATION_ENTERED,
      properties: {
        origin: 'SETTINGS'
      }
    })
  }

  return props.data.cata({
    Failure: () => <DataError />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => (
      <Success
        {...props}
        {...val}
        onSubmit={handleSubmit}
        initialValues={{
          ...val.userData
        }}
      />
    )
  })
}

const mapStateToProps = (state: RootState) => ({
  countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null),
  data: getData(state),
  formValues: selectors.form.getFormValues(USER_INFO_DETAILS)(state) as
    | InfoAndResidentialFormValuesType
    | undefined,
  hasCowboysTag: selectors.modules.profile.getCowboysTag(state).getOrElse(false),
  usState: selectors.core.settings.getUsState(state).getOrElse(null)
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  identityVerificationActions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  onClose: () => void
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(UserInfoDetails)
