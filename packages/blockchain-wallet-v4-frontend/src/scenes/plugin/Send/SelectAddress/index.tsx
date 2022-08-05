import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import getData from 'blockchain-wallet-v4-frontend/src/modals/Eth/SendEth/FirstStep/selectors'
import { AvailableSteps } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send'
import { bindActionCreators } from 'redux'

import { SpinningLoader } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions } from 'data'

import Success from './template.success'

const FirstStep: React.FC<Props> = (props) => {
  const { data } = props

  return data.cata({
    Failure: (message) => <>{message}</>,
    Loading: () => (
      <Flex justifyContent='center' alignItems='center'>
        <SpinningLoader borderWidth='4px' width='36px' height='36px' />
      </Flex>
    ),
    NotAsked: () => null,
    Success: (value) => <Success {...props} {...value} />
  })
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type SendProps = {
  coin: string
  history: {
    goBack: (value: number) => void
    push: (path: string) => void
  }
  step: number
}

type Props = SendProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep)
