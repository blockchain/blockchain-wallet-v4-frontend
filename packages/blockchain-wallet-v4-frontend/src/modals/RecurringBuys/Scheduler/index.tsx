import React, { useEffect } from 'react'
import { connect, ConnectedProps, useDispatch } from 'react-redux'

import { SBPaymentMethodType } from 'core/types'
import { actions } from 'data'

import Success from './template.success'

const SchedulerContainer = (props: Props) => {
  const dispatch = useDispatch()
  const { method } = props

  useEffect(() => {
    dispatch(actions.components.recurringBuy.fetchMethods())
  }, [dispatch, method])

  return <Success {...props} />
}

const mapStateToProps = () => ({})

const connector = connect(mapStateToProps)

type OwnProps = { children: React.ReactNode; method?: SBPaymentMethodType; onClick: () => void }
export type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(SchedulerContainer)
