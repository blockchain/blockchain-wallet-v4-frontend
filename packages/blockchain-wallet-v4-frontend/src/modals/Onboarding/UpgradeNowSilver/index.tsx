import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { Text } from 'blockchain-info-components'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import getData from './selectors'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
} & ModalPropsType

const UpgradeNowSilver = (props: Props) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    props.fetchInterestEDDStatus()
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      props.close()
    }, duration)
  }

  return (
    <Flyout {...props} onClose={handleClose} isOpen={show} data-e2e='tradingLimitsModal'>
      <FlyoutChild>
        {props.data.cata({
          Failure: (error) => (
            <Text color='red600' size='14px' weight={400}>
              {error}
            </Text>
          ),
          Loading: () => null,
          NotAsked: () => null,
          Success: (val) => <Success {...val} {...props} handleClose={handleClose} />
        })}
      </FlyoutChild>
    </Flyout>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInterestEDDStatus: () => dispatch(actions.components.interest.fetchEDDStatus()),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalName.UPGRADE_NOW_SILVER_MODAL, { transition: duration }),
  connector
)

export type SuccessStateType = ReturnType<typeof getData>['data']

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(UpgradeNowSilver)
