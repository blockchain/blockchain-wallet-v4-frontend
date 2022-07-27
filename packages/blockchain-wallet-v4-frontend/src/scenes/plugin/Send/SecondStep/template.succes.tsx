import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconArrowLeft, IconArrowUpRight, IconCheck } from '@blockchain-com/icons'
import SpeedUpPopup from 'blockchain-wallet-v4-frontend/src/scenes/plugin/common/SpeedUp'
import TransactionStatus from 'blockchain-wallet-v4-frontend/src/scenes/plugin/common/TransactionStatus'
import { AvailableCoins } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import { actions } from 'data'

import CancelSending from './CancelSending'

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

const IconArrowLeftWrapper = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: transparent;
  padding: 0;
  color: ${(props) => props.theme.grey600};
  outline: none;
  border: none;
  cursor: pointer;

  &:hover {
    background: transparent;
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

const EditButton = styled.button`
  padding: 0;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.blue600};
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
`

const TextWrapper = styled(Text)`
  text-align: right;
`

const Success: React.FC<Props> = (props) => {
  const { amount, coin, fee, from, handleSubmit, history, sendActions, toAddress } = props
  const [isSpeedUpTransactionPopupVisible, setIsSpeedUpTransactionPopupVisible] =
    useState<boolean>(false)
  const [isCancelButtonClicked, setIsCancelButtonClicked] = useState<boolean>(false)
  const [isSuccessTransactionPopupVisible, setIsSuccessTransactionPopupVisible] =
    useState<boolean>(false)

  const changeSpeedUpTransactionPopupVisibility = () => {
    setIsSpeedUpTransactionPopupVisible(!isSpeedUpTransactionPopupVisible)
  }

  const changeCancelSendingPopupVisibility = () => {
    setIsCancelButtonClicked(!isCancelButtonClicked)
  }

  const changeSuccesTransactionPopupVisibility = () => {
    setIsSuccessTransactionPopupVisible(!isSuccessTransactionPopupVisible)
  }

  const submit = () => {
    handleSubmit()
    changeSuccesTransactionPopupVisibility()
  }

  return (
    <Wrapper>
      <IconArrowLeftWrapper
        data-e2e='back-send'
        onClick={() => sendActions.sendEthSecondStepCancelClicked()}
      >
        <IconArrowLeft height='24px' width='24px' cursor='pointer' />
      </IconArrowLeftWrapper>
      <Text size='20px' lineHeight='30px' weight={500} color='white'>
        <FormattedMessage id='scenes.plugin.send.second-step.title' defaultMessage='Sending' />
      </Text>
      <div>
        <CoinDisplay weight={500} size='16px' color='white' coin={coin}>
          {amount}
        </CoinDisplay>
        <FiatDisplay size='12px' weight={500} color='grey400' coin={coin}>
          {amount}
        </FiatDisplay>
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
            <CryptoAddress>{from.address}</CryptoAddress>
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
            <CryptoAddress>{toAddress}</CryptoAddress>
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
            {fee}
          </CoinDisplay>
        </Flex>
        <Flex justifyContent='space-between'>
          <Text size='12px' lineHeight='18px' weight={500} color='grey400'>
            <FormattedMessage
              id='scenes.plugin.send.second-step.expiration_time_label'
              defaultMessage='Likely in < 30 seconds'
            />
          </Text>
          <FiatDisplay size='14px' lineHeight='21px' weight={500} color='grey400' coin='ETH'>
            {fee}
          </FiatDisplay>
        </Flex>
        <Flex alignItems='center' justifyContent='flex-end'>
          <TextWrapper size='14px' lineHeight='21px' weight={500} color='grey400'>
            <FormattedMessage
              id='scenes.plugin.send.second-step.max_fee_label'
              defaultMessage='Max Fee'
            />
            :
          </TextWrapper>
          <FiatDisplay
            size='14px'
            lineHeight='21px'
            weight={500}
            color='grey400'
            coin={AvailableCoins.ETH}
          >
            {fee}
          </FiatDisplay>
        </Flex>
        <Flex justifyContent='flex-end'>
          <EditButton onClick={changeSpeedUpTransactionPopupVisibility}>
            <FormattedMessage
              id='scenes.plugin.send.second-step.edit_button_label'
              defaultMessage='Edit'
            />
          </EditButton>
        </Flex>
      </Flex>
      <Flex justifyContent='space-between'>
        <Button
          onClick={changeCancelSendingPopupVisibility}
          nature='white-transparent'
          data-e2e='pluginSendingBackButton'
          id='pluginSecondStepSendEthCancel'
          height='48px'
        >
          <FormattedMessage
            id='scenes.plugin.send.second-step.cancel_button'
            defaultMessage='Cancel'
          />
        </Button>
        <Button onClick={handleSubmit} height='48px' data-e2e='pluginSendNextButton'>
          <FormattedMessage id='scenes.plugin.send.second-step.next_button' defaultMessage='Next' />
        </Button>
      </Flex>
      {isSpeedUpTransactionPopupVisible && (
        <SpeedUpPopup coin={coin} changePopupVisibility={changeSpeedUpTransactionPopupVisibility} />
      )}
      {isCancelButtonClicked && (
        <CancelSending
          history={history}
          changeCancelSendingPopupVisibility={changeCancelSendingPopupVisibility}
        />
      )}
      {isSuccessTransactionPopupVisible && (
        <TransactionStatus
          closePopup={changeSuccesTransactionPopupVisibility}
          history={history}
          messageId='scenes.plugin.send.second-step.cancel-sending.title'
          title='Transaction cancelled'
        >
          <IconCheck height='70%' width='70%' color='black' />
        </TransactionStatus>
      )}
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.sendEth, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type SuccessProps = {
  amount: string
  coin: string
  fee: string
  from: {
    address: string
  }
  handleSubmit: () => void
  history: {
    push: (path: string) => void
  }
  toAddress: string
}

type Props = SuccessProps & ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(Success)
