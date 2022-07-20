import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

import AdditionalInfo from './template'

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  closeAllModals: () => dispatch(actions.modals.closeAllModals()),
  goToNextStep: () => dispatch(actions.components.identityVerification.goToNextStep())
})

const mapStateToProps = (state: RootState) => ({
  userData: selectors.modules.profile.getUserData(state).getOrElse({
    tiers: { current: 0 }
  } as UserDataType)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  onClose: () => void
}

export type Props = OwnProps & ConnectedProps<typeof connector>
export default connector(AdditionalInfo)
