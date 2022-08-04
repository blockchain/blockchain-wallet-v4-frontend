import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, useDispatch, useSelector } from 'react-redux'
import { IconArrowUpRight } from '@blockchain-com/icons'
import { useQueryTransactionRequestPameters } from 'blockchain-wallet-v4-frontend/src/hooks/useQueryTransactionRequestPameters'
import { SupportedRPCMethods } from 'plugin/provider/utils'
import { CombinedState } from 'redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'

const Wrapper = styled(Flex)`
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  #pluginSecondStepSendEthCancel {
    background: transparent;
    color: ${(props) => props.theme.white};
    border: none;
  }
`

const IconArrowUpRightWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  height: 40px;
  width: 40px;
  background: transparent;
  border: 1px solid ${(props) => props.theme.white};
`

const TextWrapper = styled(Text)`
  text-align: right;
`

const SendTransaction = (props) => {
  const { isCoinDataLoaded } = props
  const dispatch = useDispatch()

  const queryTransactionRequestParameters = useQueryTransactionRequestPameters(
    props.history.location.search
  )

  const transactionRequest = useSelector((state: CombinedState<any>) =>
    selectors.components.plugin.getTransactionRequest(state)
  )

  const sendTransaction = () => {
    if (!transactionRequest) {
      return
    }

    let updatedSendTransaction = {}
    /* eslint-disable */
    for (let property in transactionRequest) {
      if (transactionRequest[property]) {
        updatedSendTransaction = {
          ...updatedSendTransaction,
          [property]: transactionRequest[property]
        }
      }
    }
    dispatch(actions.components.plugin.sendTransaction(updatedSendTransaction))
  }

  const calculateFee = () => {
    let fee = 0

    if (!(transactionRequest && transactionRequest.maxPriorityFeePerGas && transactionRequest.gasLimit)) {
      return fee
    }

    const maxPriorityFeePerGas = parseInt(String(transactionRequest.maxPriorityFeePerGas), 16)
    fee = maxPriorityFeePerGas * Number(transactionRequest.gasLimit)

    return fee
  }

  const calculateValue = () => {
    if (!(transactionRequest && transactionRequest.value)) {
      return 0
    }
    return parseInt(String(transactionRequest.value), 16)
  }

  const getTransactionRequestField = (field: string) => {
    if (!(transactionRequest && transactionRequest[field])) {
      return ''
    }
    return transactionRequest[field]
  }

  const closePopup = () => {
    window.close()
  }

  useEffect(() => {
    queryTransactionRequestParameters && dispatch(actions.components.plugin.initTransactionRequestParameters(queryTransactionRequestParameters))
  }, [queryTransactionRequestParameters])

  useEffect(() => {
    window.onbeforeunload = () => {
      chrome.runtime.sendMessage({
        data: null,
        type: SupportedRPCMethods.SendTransaction
      })
    }
  }, [])

  return (
    isCoinDataLoaded && <Wrapper>
      <Text size='20px' lineHeight='30px' weight={500} color='white'>
        <FormattedMessage id='scenes.plugin.send.second-step.title' defaultMessage='Sending' />
      </Text>
      <div>
        <CoinDisplay weight={500} size='16px' color='white' coin='ETH'>
          {calculateValue()}
        </CoinDisplay>
      </div>
      <Flex justifyContent='space-between'>
        <div>
          <Text size='12px' lineHeight='18px' weight={500} color='grey400'>
            <FormattedMessage
              id='pscenes.plugin.send.second-step.from_label'
              defaultMessage='From'
            />
          </Text>
          <Text size='14px' lineHeight='21px' weight={500} color='white'>
            <CryptoAddress>{getTransactionRequestField('from')}</CryptoAddress>
          </Text>
        </div>
        <IconArrowUpRightWrapper>
          <IconArrowUpRight height='24px' width='24px' color='white' />
        </IconArrowUpRightWrapper>
        <div>
          <Text size='12px' lineHeight='18px' weight={500} color='grey400'>
            <FormattedMessage id='scenes.plugin.send.second-step.to_label' defaultMessage='To' />
          </Text>
          <Text size='14px' lineHeight='21px' weight={500} color='white'>
            <CryptoAddress>{getTransactionRequestField('to')}</CryptoAddress>
          </Text>
        </div>
      </Flex>
      <Flex flexDirection='column'>
        <Flex justifyContent='space-between'>
          <Text color='grey400'>
            <FormattedMessage
              id='scenes.plugin.send.second-step.network_label'
              defaultMessage='Network'
            />
          </Text>
          <Text color='white' size='16px' lineHeight='24px' weight={600}>
            <FormattedMessage
              id='scenes.plugin.send.second-step.network_title'
              defaultMessage='Ethereum mainnet'
            />
          </Text>
        </Flex>
      </Flex>
      <Flex flexDirection='column' justifyContent='flex-start'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Text size='12px' lineHeight='18px' weight={500} color='grey400'>
            <FormattedMessage
              id='scenes.plugin.send.second-step.estimated_gas_fee_label'
              defaultMessage='Estimated Gas Fee'
            />
          </Text>
          <CoinDisplay size='16px' lineHeight='24px' weight={600} color='white' coin='ETH'>
            {calculateFee()}
          </CoinDisplay>
        </Flex>
        <Flex justifyContent='space-between'>
          <Text size='12px' lineHeight='18px' weight={500} color='grey400'>
            <FormattedMessage
              id='scenes.plugin.send.second-step.expiration_time_label'
              defaultMessage='Likely in < 30 seconds'
            />
          </Text>
          <CoinDisplay size='14px' lineHeight='21px' weight={500} color='grey400' coin='ETH'>
            {calculateFee()}
          </CoinDisplay>
        </Flex>
        <Flex alignItems='center' justifyContent='flex-end'>
          <TextWrapper size='14px' lineHeight='21px' weight={500} color='grey400'>
            <FormattedMessage
              id='scenes.plugin.send.second-step.max_fee_label'
              defaultMessage='Max Fee'
            />
            :
          </TextWrapper>
          <CoinDisplay
            size='14px'
            lineHeight='21px'
            weight={500}
            color='grey400'
            coin='ETH'
          >
            {calculateFee()}
          </CoinDisplay>
        </Flex>
      </Flex>
      <Flex justifyContent='space-between'>
        <Button
          nature='white-transparent'
          data-e2e='pluginSendingBackButton'
          id='pluginSecondStepSendEthCancel'
          height='48px'
          onClick={closePopup}
        >
          <FormattedMessage
            id='scenes.plugin.send.second-step.cancel_button'
            defaultMessage='Cancel'
          />
        </Button>
        <Button onClick={sendTransaction} height='48px' data-e2e='pluginSendNextButton'>
          <FormattedMessage id='scenes.plugin.send.second-step.next_button' defaultMessage='Next' />
        </Button>
      </Flex>
    </Wrapper>
  )
}


const mapStateToProps = (state) => ({
  isCoinDataLoaded: selectors.core.data.coins.getIsCoinDataLoaded(state),
})

export default connect(mapStateToProps)(SendTransaction)
