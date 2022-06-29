import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconCheckCircle, IconChevronDownV2, IconCloseCircle } from '@blockchain-com/icons'
import Amount from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/AssetsAndAmount/Amount'
import SelectCrypto from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/AssetsAndAmount/Assets'
import CryptoItem from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/AssetsAndAmount/Assets/Asset'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { AvailableSteps } from '..'

const Wrapper = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 100%;
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
  color: ${(props) => props.theme.grey500};
`

const SavedWalletWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const AssetWrapper = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin: 5px auto;
  padding: 4px 0px;
  width: 100%;
  border-radius: 8px;
  background: black;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.exchangeLogin};
  }
`

const Label = styled(Text)`
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.grey400};
  margin-top: 35px;
`

type AssetsAndAmountProps = {
  address: string
  changeStep: (step: AvailableSteps) => void
}

const AssetsAndAmount: React.FC<AssetsAndAmountProps> = ({ address, changeStep }) => {
  const [isSelectCryptoListVisible, setIsSelectCryptoListVisible] = useState<boolean>(false)

  const [selectedCoin, setSelectedCoin] = useState<string>('ETH')

  // changes select crypto list visibility
  const changeSelectCryptoListVisibility = () => {
    setIsSelectCryptoListVisible(!isSelectCryptoListVisible)
  }

  const selectCoin = (coin: string) => {
    setSelectedCoin(coin)
    setIsSelectCryptoListVisible(!isSelectCryptoListVisible)
  }

  return (
    <Wrapper>
      <SavedWalletWrapper>
        <IconCloseCircle
          height='16px'
          width='16px'
          onClick={() => changeStep(AvailableSteps.Recents)}
        />
        <SavedWallet>
          <Text size='14px' lineHeight='21px' weight={500}>
            {address}
          </Text>
          <IconCheckCircle width='24px' height='24px' color='white' />
        </SavedWallet>
      </SavedWalletWrapper>
      <Label>
        <FormattedMessage id='plugin.send.assets_label' defaultMessage='Assets' />
      </Label>
      <AssetWrapper>
        <CryptoItem coin={selectedCoin} selectCoin={selectCoin} />
        <IconChevronDownV2 color='grey400' />
      </AssetWrapper>
      <Label>
        <FormattedMessage id='plugin.send.amount_label' defaultMessage='Amount' />
      </Label>
      <Amount coin={selectedCoin} />
      <Flex justifyContent='space-between'>
        <Button nature='white-transparent' data-e2e='pluginSendCancelButton' height='48px'>
          <FormattedMessage id='plugin.send.cancel_button' defaultMessage='Cancel' />
        </Button>
        <Button height='48px' data-e2e='pluginSendNextButton'>
          <FormattedMessage id='plugin.send.next_button' defaultMessage='Next' />
        </Button>
      </Flex>
      {isSelectCryptoListVisible && (
        <SelectCrypto
          changeSelectCryptoListVisibility={changeSelectCryptoListVisibility}
          selectCoin={selectCoin}
        />
      )}
    </Wrapper>
  )
}

export default AssetsAndAmount
