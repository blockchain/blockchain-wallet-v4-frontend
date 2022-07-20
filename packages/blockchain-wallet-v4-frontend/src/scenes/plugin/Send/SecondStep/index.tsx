import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { SpinningLoader } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions } from 'data'

import { getData } from './selectors'
import Success from './template.succes'

const SecondStep = (props) => {
  const { changeStep, coin, data, sendActions } = props

  return data.cata({
    Failure: (message) => <>{message}</>,
    Loading: () => (
      <Flex justifyContent='center' alignItems='center'>
        <SpinningLoader borderWidth='4px' width='36px' height='36px' />
      </Flex>
    ),
    NotAsked: () => null,
    Success: (value) => (
      <Success
        changeStep={changeStep}
        coin={coin}
        {...value}
        {...props}
        handleSubmit={sendActions.sendEthSecondStepSubmitClicked}
      />
    )
  })
}
const mapStateToProps = (state, props) => ({
  data: getData(state, props.coin)
})

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.sendEth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStep)
