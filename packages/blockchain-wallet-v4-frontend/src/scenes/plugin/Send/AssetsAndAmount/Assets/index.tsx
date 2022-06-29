import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconArrowLeft, IconSearch } from '@blockchain-com/icons'
import Asset from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/AssetsAndAmount/Assets/Asset'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: -80px;
  left: -25px;
  width: 360px;
  height: 654px;
  color: ${(props) => props.theme.grey600};
  background: ${(props) => props.theme.black};
`

const IconArrowLeftWrapper = styled.div`
  margin: 25px 0 0 25px;
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

type AssetsProps = {
  changeSelectCryptoListVisibility: () => void
  selectCoin: (coin: string) => void
}

const Assets: React.FC<AssetsProps> = ({ changeSelectCryptoListVisibility, selectCoin }) => {
  const [asset, setAsset] = useState<string>('')

  // searches wallet
  const searchAsset = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: search logic
    setAsset(e.target.value)
  }

  return (
    <Wrapper>
      <IconArrowLeftWrapper>
        <IconArrowLeft width='16px' height='16px' onClick={changeSelectCryptoListVisibility} />
      </IconArrowLeftWrapper>
      <FormattedMessage id='plugin.send.assets_search_label' defaultMessage='Search coins'>
        {() => <Input value={asset} onChange={searchAsset} />}
      </FormattedMessage>
      <IconSearchWrrapper>
        <IconSearch />
      </IconSearchWrrapper>
      <Asset selectCoin={selectCoin} coin='ETH' />
      <Asset selectCoin={selectCoin} coin='USDC' />
    </Wrapper>
  )
}

export default Assets
