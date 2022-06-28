import React, { MouseEvent, useState } from 'react'
import { useSelector } from 'react-redux'
import { IconCheckCircle, IconCopy } from '@blockchain-com/icons'
import Tooltip from 'blockchain-wallet-v4-frontend/src/scenes/plugin/SwitchAccount/Tooltip'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { getBalanceSelector } from 'components/Balances/selectors'
import FiatDisplay from 'components/Display/FiatDisplay'
import { RootState } from 'data/rootReducer'

import { SwapAccountType } from '..'

const AccountBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 0;
  cursor: pointer;
`
const ConnectBlock = styled.div`
  position: relative;
  #tooltip {
    display: none;
  }
  &:hover {
    #tooltip {
      display: block;
    }
  }
`
const AccountInfo = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: auto auto auto 16px;
  #tooltip {
    display: none;
  }
  &:hover {
    #tooltip {
      display: block;
    }
  }
`
const IconCheckWrapper = styled(IconCheckCircle)`
  path {
    fill: ${(props) => props.theme.white};
  }
`
const IconUncheckCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.grey800};
`
const WalletBlock = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: copy;
`
class TooltipProperties {
  public backgroundColor: string

  public index: number

  public leftBlockPosition: number

  public leftTrianglePosition: number

  public text: string

  public textColor: string

  public constructor(
    backgroundColor,
    index,
    leftBlockPosition,
    leftTrianglePosition,
    text,
    textColor
  ) {
    this.backgroundColor = backgroundColor
    this.index = index
    this.leftBlockPosition = leftBlockPosition
    this.leftTrianglePosition = leftTrianglePosition
    this.text = text
    this.textColor = textColor
  }
}

type AccountProps = {
  account: SwapAccountType
  activeAccountIndex: number
  copiedWalletAddress: string | number
  setActiveAccountIndex: (activeAccountIndex: number) => void
  setCopiedWalletAddress: (copiedWalletAddress: string | number) => void
}

export const Account: React.FC<AccountProps> = ({
  account,
  activeAccountIndex,
  copiedWalletAddress,
  setActiveAccountIndex,
  setCopiedWalletAddress
}) => {
  const state = useSelector((state: RootState) => state)
  const balance = getBalanceSelector(account.coin)(state).getOrElse(0)
  const [tooltipProperties, setTooltipProperties] = useState<TooltipProperties>(
    new TooltipProperties('black', 0, 50, 50, 'Copy to clipboard', 'grey400')
  )
  const defaultTooltipProperties = new TooltipProperties(
    'black',
    0,
    50,
    50,
    'Copy to clipboard',
    'grey400'
  )

  const copyAddress = (event: MouseEvent<HTMLDivElement>, address: string | number): void => {
    event.stopPropagation()
    navigator.clipboard.writeText(address.toString())
    setCopiedWalletAddress(address)
    setTooltipProperties(
      new TooltipProperties('white', account.accountIndex, 50, 50, 'Copied!', 'black')
    )
  }

  const shortingAddress = (address: string | number): string => {
    const addressString: string = address.toString()
    return `${addressString.slice(0, 4)}...${addressString.slice(-4)}`
  }

  const displayAccountIcon = () => {
    switch (account.coin) {
      case 'ETH':
        return <Icon size='24' name={account.coin} />
        break
      case 'BTC':
        return <Icon size='24' name={account.coin} />
        break
      case 'BCH':
        return <Icon size='24' name={account.coin} />
        break
      case 'XLM':
        return <Icon size='24' name={account.coin} />
        break
      default:
        return <Icon size='24' name={account.coin} />
        break
    }
  }

  return (
    <AccountBlock
      key={account.accountIndex}
      onClick={() => setActiveAccountIndex(account.accountIndex)}
    >
      {displayAccountIcon()}
      <AccountInfo>
        {account.address === copiedWalletAddress ? (
          <Tooltip tooltipProperties={tooltipProperties} />
        ) : (
          <Tooltip tooltipProperties={defaultTooltipProperties} />
        )}
        <WalletBlock
          onClick={(event: MouseEvent<HTMLDivElement>) => copyAddress(event, account.address)}
        >
          <Text
            size='16px'
            color='white'
            weight={600}
            lineHeight='150%'
            style={{ marginRight: '9px' }}
          >
            {shortingAddress(account.address)}
          </Text>
          <IconCopy color={`${(props) => props.theme.exchangeLogin}`} width={16} height={16} />
        </WalletBlock>
        <FiatDisplay color='grey400' size='12px' weight={500} coin={account.coin}>
          {balance}
        </FiatDisplay>
      </AccountInfo>
      {activeAccountIndex === account.accountIndex ? (
        <ConnectBlock>
          <IconCheckWrapper height='24px' width='24px' />
          <Tooltip
            tooltipProperties={
              new TooltipProperties('white', account.accountIndex, 70, 65, 'Connected!', 'black')
            }
          />
        </ConnectBlock>
      ) : (
        <ConnectBlock>
          <IconUncheckCircle />
          <Tooltip
            tooltipProperties={
              new TooltipProperties('black', account.accountIndex, 50, 50, 'Connect', 'grey400')
            }
          />
        </ConnectBlock>
      )}
    </AccountBlock>
  )
}
