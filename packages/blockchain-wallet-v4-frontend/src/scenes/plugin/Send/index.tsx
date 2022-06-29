import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconClose } from '@blockchain-com/icons'
import styled from 'styled-components'

import { isValidAddress } from '@core/utils/eth'
import { Text, TooltipHost } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import AssetsAndAmount from './AssetsAndAmount'
import WalletItem from './WalletItem'

const Wrapper = styled(Flex)`
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  color: ${(props) => props.theme.white};
`

const InputWrapper = styled(Flex)`
  .invalid-wallet-address {
    border: 1px solid ${(props) => props.theme.red400};
  }
`

const Input = styled.input`
  margin: 17px auto;
  padding: 16px 12px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.blue400};
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.grey600};
  background: none;
  outline: none;
`

const Title = styled(Text)`
  color: ${(props) => props.theme.white};
  font-size: 20px;
  line-height: 30px;
  font-weight: 500;
`

const Recents = styled(Flex)`
  flex-direction: column;
  margin-top: 50px;
`

const SubTitle = styled(Text)`
  margin: 0 0 20px;
  color: ${(props) => props.theme.grey400};
  font-size: 14px;
  line-height: 21px;
  font-weight: 500;
`

const ErrorText = styled(Text)`
  color: ${(props) => props.theme.red400};
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
`

// defines available steps to send amount
export enum AvailableSteps {
  Recents = 1,
  Amount = 2
}

type SendProps = {
  history: { goBack: (value: number) => void }
}

const Send: React.FC<SendProps> = (props) => {
  const [address, setAddress] = useState<string>('')
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [step, setStep] = useState<number>(AvailableSteps.Recents)

  // TODO: mock recent wallets data replace with real.
  const recentWallets: string[] = [
    'J4Pd7dB08D75679bbE90b7B1eDfB8BE3a16897Ee77',
    'J4Ad7dB08D75679bbE90b7B1eDfB8BE3a16897Ee77'
  ]

  const changeStep = (step: AvailableSteps) => {
    setStep(step)
  }

  // changes and validates wallet address
  const changeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
    if (!isValidAddress(e.target.value)) {
      setIsTooltipVisible(true)
      return
    }
    setIsTooltipVisible(false)
    setStep(AvailableSteps.Amount)
  }

  // chooses address from recent addresses
  const chooseAddress = (address: string) => {
    setAddress(address)
    setStep(AvailableSteps.Amount)
  }

  const goBack = () => {
    props.history.goBack(-1)
  }

  // indicates if recents wallets are shown
  const isRecentsWalletsShown: boolean = step === AvailableSteps.Recents
  // indicates if amount is shown
  const isAmountShown: boolean = step === AvailableSteps.Amount

  return (
    <Wrapper>
      <Flex justifyContent='flex-end'>
        <IconClose height='24px' width='24px' cursor='pointer' onClick={goBack} />
      </Flex>
      <Title>
        <FormattedMessage id='scenes.plugin.send.title' defaultMessage='Send to' />
      </Title>
      {isRecentsWalletsShown && (
        <InputWrapper>
          <FormattedMessage
            id='plugin.send.wallet_address_placeholder'
            defaultMessage='|Search, public address (0x), or ENS'
          >
            {() => (
              <Input
                type='text'
                value={address}
                onChange={changeAddress}
                id='sendToWalletAddress'
                className={`${isTooltipVisible && 'invalid-wallet-address'}`}
              />
            )}
          </FormattedMessage>
        </InputWrapper>
      )}
      {isTooltipVisible && (
        <TooltipHost id='plugin_send_invalid_address'>
          <ErrorText>
            <FormattedMessage
              id='plugin.send.tooltip_invalid_address'
              defaultMessage='Invalid Address'
            />
          </ErrorText>
        </TooltipHost>
      )}
      {isRecentsWalletsShown && (
        <Recents>
          <SubTitle>
            <FormattedMessage id='plugin.send.recents_title' defaultMessage='Recents' />
          </SubTitle>
          {recentWallets.map((address: string) => (
            <WalletItem address={address} key={address} chooseAddress={chooseAddress} />
          ))}
        </Recents>
      )}
      {isAmountShown && <AssetsAndAmount changeStep={changeStep} address={address} />}
    </Wrapper>
  )
}

export default Send
