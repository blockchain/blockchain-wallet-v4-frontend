import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, model, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import SendBtc from './template'

type OwnProps = {
  amount: number
  closeAll: () => void
  description: string
  excludeHDWallets: boolean
  from: any
  lockboxIndex: number
  payPro: boolean
  position: number
  step: number
  to: any
  total: number
}
type LinkDispatchPropsType = {
  actions: typeof actions.components.sendBtc
}
type Props = OwnProps & LinkDispatchPropsType

class SendBtcContainer extends React.PureComponent<Props> {
  componentDidMount() {
    const { amount, description, from, lockboxIndex, payPro, to } = this.props
    this.props.actions.initialized({
      from,
      to,
      description,
      amount,
      lockboxIndex,
      payPro
    })
  }

  componentWillUnmount() {
    this.props.actions.destroyed()
  }

  render() {
    const {
      amount,
      closeAll,
      description,
      excludeHDWallets,
      payPro,
      position,
      step,
      to,
      total
    } = this.props

    return (
      <SendBtc position={position} total={total} closeAll={closeAll}>
        {step === 1 && (
          <FirstStep
            to={to}
            amount={amount}
            description={description}
            excludeHDWallets={excludeHDWallets}
            payPro={payPro}
          />
        )}
        {step === 2 && <SecondStep payPro={payPro} />}
      </SendBtc>
    )
  }
}

const mapStateToProps = state => ({
  step: selectors.components.sendBtc.getStep(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

const enhance = compose(
  modalEnhancer(model.components.sendBtc.MODAL),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SendBtcContainer)
