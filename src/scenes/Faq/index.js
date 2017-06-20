import React from 'react'
import Faq from './template.js'

class FaqContainer extends React.Component {
  render () {
    let items = [
    { title: 'FAQ_QUESTIONS.CAN_I_BUY.Q', description: 'FAQ_QUESTIONS.CAN_I_BUY.A' },
    { title: 'FAQ_QUESTIONS.WALLET_SAFETY.Q', description: 'FAQ_QUESTIONS.WALLET_SAFETY.A' },
    { title: 'FAQ_QUESTIONS.WALLET_ID_VS_ADDRESS.Q', description: 'FAQ_QUESTIONS.WALLET_ID_VS_ADDRESS.A' },
    { title: 'FAQ_QUESTIONS.HOW_TO_TRANSACT.Q', description: 'FAQ_QUESTIONS.HOW_TO_TRANSACT.A' },
    { title: 'FAQ_QUESTIONS.HOW_MUCH_TO_SEND.Q', description: 'FAQ_QUESTIONS.HOW_MUCH_TO_SEND.A' },
    { title: 'FAQ_QUESTIONS.WHEN_IS_A_TX_CONFIRMED.Q', description: 'FAQ_QUESTIONS.WHEN_IS_A_TX_CONFIRMED.A' },
    { title: 'FAQ_QUESTIONS.CAN_BC_SEE_FUNDS.Q', description: 'FAQ_QUESTIONS.CAN_BC_SEE_FUNDS.A' },
    { title: 'FAQ_QUESTIONS.CAN_BC_RESET_PW.Q', description: 'FAQ_QUESTIONS.CAN_BC_RESET_PW.A' }]

    return (
      <Faq items={items} />
    )
  }
}

export default FaqContainer
