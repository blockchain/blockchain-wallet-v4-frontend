import { connect, ConnectedProps } from 'react-redux'

import { actions } from 'data'

import AdditionalInfo from './template'

const mapDispatchToProps = dispatch => ({
  goToNextStep: () =>
    dispatch(actions.components.identityVerification.goToNextStep()),
  closeAllModals: () => dispatch(actions.modals.closeAllModals())
})

const connector = connect(undefined, mapDispatchToProps)

export type OwnProps = {
  onClose: () => void
}

export type Props = OwnProps & ConnectedProps<typeof connector>
export default connector(AdditionalInfo)
