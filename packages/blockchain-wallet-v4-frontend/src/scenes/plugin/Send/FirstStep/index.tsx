import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import getData from 'blockchain-wallet-v4-frontend/src/modals/Eth/SendEth/FirstStep/selectors'
import { SEND_FORM } from 'blockchain-wallet-v4-frontend/src/modals/SendCrypto/model'
import { AvailableSteps } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send'
import { bindActionCreators, compose } from 'redux'
import { reduxForm } from 'redux-form'

import { BlockchainLoader } from 'blockchain-info-components'
import { actions } from 'data'

import FirstStepSuccess from './template.success'

const FirstStep: React.FC<Props> = (props) => {
  const { changeCoin, coin, data, history, sendActions } = props

  const firstStepConfirm = () => {
    sendActions.sendEthFirstStepSubmitClicked()
  }

  // Re-inits payment provider for selected coin, i.e 'ETH' or erc20 token
  const reInitCoinPayment = () => {
    sendActions.initialized(coin)
  }

  return data.cata({
    Failure: (message) => <>{message}</>,
    Loading: () => <BlockchainLoader height='24px' width='24px' />,
    NotAsked: () => null,
    Success: (value) => {
      return (
        <FirstStepSuccess
          changeCoin={changeCoin}
          coin={coin}
          firstStepConfirm={firstStepConfirm}
          history={history}
          reInitCoinPayment={reInitCoinPayment}
          {...value}
        />
      )
    }
  })
}

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.sendEth, dispatch)
})

const mapStateToProps = (state, props) => ({
  data: getData(state, props.coin)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type FirstStepProps = {
  changeCoin: (coin: string) => void
  coin: string
  history: {
    push: (path: string) => void
  }
}

type Props = FirstStepProps & ConnectedProps<typeof connector>

const enhance = compose(
  reduxForm<{}, Props>({
    destroyOnUnmount: false,
    form: SEND_FORM
  }),
  connector
)

export default enhance(FirstStep) as React.ComponentType<FirstStepProps>
