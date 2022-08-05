import React, { useState } from 'react'
import { IconArrowLeft, IconSearch } from '@blockchain-com/icons'
import { AvailableCoins } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send'
import Asset from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/FirstStep/Assets/Asset'
import styled from 'styled-components'

import { Flex } from 'components/Flex'

const Wrapper = styled(Flex)`
  flex-direction: column;
  position: absolute;
  top: -24px;
  left: -24px;
  width: 360px;
  height: 600px;
  color: ${(props) => props.theme.grey600};
  background: ${(props) => props.theme.black};
`

const IconArrowLeftWrapper = styled.div`
  margin: 25px 0 0 25px;
  cursor: pointer;
`

const IconSearchWrrapper = styled.div`
  position: absolute;
  top: 110px;
  right: 30px;
  height: 24px;
  width: 24px;
`

const Input = styled.input`
  width: 256px;
  height: 48px;
  border-radius: 8px;
  background: transparent;
  margin: 45px auto 25px;
  padding: 0 52px 0 16px;
  font-size: 16px;
  line-height: 24px;
  border: 1px solid ${(props) => props.theme.grey600};
  color: ${(props) => props.theme.white};
  outline: none;
`

const Assets: React.FC<AssetsProps> = ({ closePopup, selectCoin }) => {
  // defines searched wallet and set searched wallet
  const [searchedWallet, setSearchedWallet] = useState<string>('')

  // searches wallet
  const searchWallet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedWallet(e.target.value)
  }

  // TODO: finalize erc20 tokens list and show only balances that > 0
  return (
    <Wrapper>
      <IconArrowLeftWrapper>
        <IconArrowLeft width='16px' height='16px' onClick={closePopup} />
      </IconArrowLeftWrapper>
      <Input placeholder='Search coins' value={searchedWallet} onChange={searchWallet} />
      <IconSearchWrrapper>
        <IconSearch />
      </IconSearchWrrapper>
      <Asset selectCoin={selectCoin} coin={AvailableCoins.ETH} />
      <Asset selectCoin={selectCoin} coin={AvailableCoins.USDC} />
      <Asset selectCoin={selectCoin} coin={AvailableCoins.USDT} />
    </Wrapper>
  )
}

type AssetsProps = {
  closePopup: () => void
  selectCoin: (coin: string) => void
}

export default Assets
