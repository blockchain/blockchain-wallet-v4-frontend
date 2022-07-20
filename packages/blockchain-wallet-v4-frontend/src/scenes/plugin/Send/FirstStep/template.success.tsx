import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  IconAlert,
  IconCheckCircle,
  IconChevronDownV2,
  IconClose,
  IconCloseCircle
} from '@blockchain-com/icons'
import { AvailableSteps } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send'
import Amount from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/FirstStep/Amount'
import Assets from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/FirstStep/Assets'
import Asset from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/FirstStep/Assets/Asset'
import styled from 'styled-components'

import { Button, Text, TooltipHost } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const Wrapper = styled(Flex)`
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  width: 100%;
  height: 100%;

  #sendNotEnoughBalance {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    top: 100px;
    width: 100%;
    padding: 18px 0;
    border-radius: 16px;
    border: 1px solid ${(props) => props.theme.orange600};
    color: ${(props) => props.theme.orange600};
  }

  #pluginFirstStepSendEthCancel {
    background: transparent;
    color: ${(props) => props.theme.white};
    border: none;
  }

  #pluginFirstStepSendEthNext {
    background: ${(props) => props.theme.white};

    &:hover {
      background: ${(props) => props.theme.white};
    }
  }
`
const IconCloseWrapper = styled(Flex)`
  justify-content: flex-end;
  margin-bottom: 32px;
  color: ${(props) => props.theme.grey400};
  cursor: pointer;
`

const Title = styled(Text)`
  color: ${(props) => props.theme.white};
  font-size: 20px;
  line-height: 30px;
  font-weight: 700;
`

const SavedWallet = styled(Flex)`
  align-items: center;
  padding: 12px 16px;
  margin: 17px 0;
  width: 248px;
  overflow-wrap: break-word;
  word-break: break-word;
  border-radius: 8px;
  background: ${(props) => props.theme.exchangeLogin};
  color: ${(props) => props.theme.grey400};
`

const ButtonsWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
`

const SavedWalletWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const IconWrapper = styled.div`
  color: ${(props) => props.theme.grey400};
`

const IconCheckWrapper = styled.div`
  margin-left: 10px;
`

const AssetIconWrapper = styled.div`
  margin-left: 10px;
`

const AssetWrapper = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  margin: 0px auto;
  width: 100%;
  color: ${(props) => props.theme.grey400};
  cursor: pointer;
`

const SelectedAssetWrapper = styled(Flex)`
  width: 100%;

  &:hover {
    background: ${(props) => props.theme.exchangeLogin};
    border-radius: 8px;
  }
`

const Label = styled(Text)`
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.grey400};
  margin-top: 35px;
`

type FirstStepSuccessProps = {
  amount: string
  changeCoin: (coin: string) => void
  changeStep: (step: AvailableSteps) => void
  coin: string
  effectiveBalance: string
  firstStepConfirm: () => void
  history: {
    goBack: (value: number) => void
    push: (path: string) => void
  }
  reInitCoinPayment: () => void
  to: {
    address: string
  }
}
const FirstStepSuccess: React.FC<FirstStepSuccessProps> = (props) => {
  const {
    amount,
    changeCoin,
    changeStep,
    coin,
    effectiveBalance,
    firstStepConfirm,
    history,
    reInitCoinPayment,
    to
  } = props
  const [isAssetsPopupVisible, setIsAssetsPopupVisible] = useState<boolean>(false)
  const [isNotEnoughCoins, setIsNotEnoughCoins] = useState<boolean>(false)
  const [address, setAddress] = useState<string>('')

  // Closes assets popup
  const closeAssetsPopup = () => {
    setIsAssetsPopupVisible(!isAssetsPopupVisible)
  }

  const goBack = () => {
    history.goBack(-1)
  }

  const deleteCurrentAddress = () => {
    reInitCoinPayment()
    changeStep(AvailableSteps.SelectAddress)
  }
  const closeNotEnoughCoinsTooltip = () => {
    setIsNotEnoughCoins(false)
  }

  const selectCoin = (coin: string) => {
    changeCoin(coin)
    closeAssetsPopup()
  }

  const confirm = () => {
    const isEnoughBalanceToSendCrypto: boolean = Number(amount) <= Number(effectiveBalance)
    if (!(isEnoughBalanceToSendCrypto && effectiveBalance)) {
      setIsNotEnoughCoins(true)
      return
    }
    firstStepConfirm()
  }

  const addCrypto = () => {
    history.push(`/receive${coin}`)
  }

  useEffect(() => {
    if (!to) {
      changeStep(AvailableSteps.SelectAddress)
      return
    }
    setAddress(to.address)
  }, [])

  return (
    <Wrapper>
      <IconCloseWrapper>
        <IconClose cursor='pointer' height='24px' width='24px' onClick={goBack} />
      </IconCloseWrapper>
      <Title>
        <FormattedMessage id='scenes.plugin.send.title' defaultMessage='Send to' />
      </Title>
      <SavedWalletWrapper>
        <IconWrapper>
          <IconCloseCircle
            cursor='pointer'
            height='16px'
            width='16px'
            onClick={deleteCurrentAddress}
          />
        </IconWrapper>
        <SavedWallet>
          <Text color='grey400' size='14px' lineHeight='21px' weight={500}>
            {address}
          </Text>
          <IconCheckWrapper>
            <IconCheckCircle width='16px' height='16px' color='white' />
          </IconCheckWrapper>
        </SavedWallet>
      </SavedWalletWrapper>
      {isNotEnoughCoins && (
        <TooltipHost id='sendNotEnoughBalance'>
          <IconAlert />
          <Text size='14px' lineHeight='21px' weight={600} color='orange500'>
            <FormattedMessage
              id={`plugin.send.not-enough-${coin}`}
              defaultMessage={`Not enough ${coin}`}
            />
          </Text>
        </TooltipHost>
      )}
      <AssetWrapper>
        <Label>
          <FormattedMessage id='plugin.send.assets_label' defaultMessage='Asset' />
        </Label>
        <SelectedAssetWrapper alignItems='center'>
          <Asset coin={coin} selectCoin={selectCoin} />
          <AssetIconWrapper>
            <IconChevronDownV2 />
          </AssetIconWrapper>
        </SelectedAssetWrapper>
      </AssetWrapper>
      <Amount closeNotEnoughCoinsTooltip={closeNotEnoughCoinsTooltip} coin={coin} />
      <ButtonsWrapper>
        {isNotEnoughCoins ? (
          <Button
            width='100%'
            data-e2e='pluginSendAddCryptoButton'
            height='48px'
            onClick={addCrypto}
          >
            <FormattedMessage id='plugin.send.add-crypto_button' defaultMessage='Add crypto' />
          </Button>
        ) : (
          <Flex justifyContent='space-between'>
            <Button
              onClick={goBack}
              id='pluginFirstStepSendEthCancel'
              data-e2e='pluginSendCancelButton'
              height='48px'
            >
              <FormattedMessage id='plugin.send.cancel_button' defaultMessage='Cancel' />
            </Button>
            <Button
              id='pluginFirstStepSendEthNext'
              height='48px'
              data-e2e='pluginSendNextButton'
              onClick={confirm}
            >
              <FormattedMessage id='plugin.send.next_button' defaultMessage='Next' />
            </Button>
          </Flex>
        )}
      </ButtonsWrapper>
      {isAssetsPopupVisible && <Assets closePopup={closeAssetsPopup} selectCoin={selectCoin} />}
    </Wrapper>
  )
}

export default FirstStepSuccess
