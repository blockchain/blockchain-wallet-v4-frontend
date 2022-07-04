import React, { MouseEvent, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, useSelector } from 'react-redux'
import { IconCheckCircle, IconCopy } from '@blockchain-com/icons'
import { SwapAccountType } from 'blockchain-wallet-v4-frontend/src/data/components/swap/types'
import Tooltip from 'blockchain-wallet-v4-frontend/src/scenes/plugin/SwitchAccount/Tooltip'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { getBalanceSelector } from 'components/Balances/selectors'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

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
const CoinTextBlock = styled(Text)`
  display: flex;
`

interface TooltipProperties {
  backgroundColor: string
  index: number
  leftBlockPosition: number
  leftTrianglePosition: number
  text: string
  textColor: string
}

type AccountProps = {
  account: SwapAccountType
  copiedAccountIndex: number
  index: number
  selectedAccountIndex: number
  setCopiedAccountIndex: (copiedAccountIndex: number) => void
  setSelectedAccountIndex: (selectedAccountIndex: number) => void
}

const defaultTooltipProperties: TooltipProperties = {
  backgroundColor: 'black',
  index: 0,
  leftBlockPosition: 50,
  leftTrianglePosition: 50,
  text: 'Copy to clipboard',
  textColor: 'grey400'
}

const Account: React.FC<AccountProps & any> = ({
  account,
  addressR,
  copiedAccountIndex,
  index,
  selectedAccountIndex,
  setCopiedAccountIndex,
  setSelectedAccountIndex,
  ...props
}) => {
  const state = useSelector((state: RootState) => state)
  const balance = getBalanceSelector(account.coin)(state).getOrElse(0)
  const [tooltipProperties, setTooltipProperties] =
    useState<TooltipProperties>(defaultTooltipProperties)

  useEffect(() => {
    props.requestActions.getNextAddress(account)
  }, [])

  const changeTooltipProperties = (
    backgroundColor: string,
    index: number,
    leftBlockPosition: number,
    leftTrianglePosition: number,
    text: string,
    textColor: string
  ): TooltipProperties => {
    return { backgroundColor, index, leftBlockPosition, leftTrianglePosition, text, textColor }
  }

  const generateNextAddress = () => {
    if (account.coin === 'STX') {
      return addressR.cata({
        Failure: () =>
          setTooltipProperties(
            changeTooltipProperties('white', index, 50, 50, 'Please try again', 'black')
          ),
        Loading: () =>
          setTooltipProperties(
            changeTooltipProperties('white', index, 50, 50, 'Getting address...', 'black')
          ),
        NotAsked: () =>
          setTooltipProperties(
            changeTooltipProperties('white', index, 50, 50, 'Please try again', 'black')
          ),
        Success: (val) => val.address
      })
    }

    return addressR.cata({
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null,
      Success: (val) => val.address
    })
  }

  const copyAddress = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setCopiedAccountIndex(index)
    const accountAddress = generateNextAddress()

    if (accountAddress) {
      navigator.clipboard.writeText(accountAddress)
      setTooltipProperties(changeTooltipProperties('white', index, 50, 50, 'Copied!', 'black'))
    }
  }

  return (
    <AccountBlock key={index} onClick={() => setSelectedAccountIndex(index)}>
      <Icon size='24' name={account.coin} />
      <AccountInfo>
        {copiedAccountIndex === index ? (
          <Tooltip tooltipProperties={tooltipProperties} />
        ) : (
          <Tooltip tooltipProperties={defaultTooltipProperties} />
        )}
        <WalletBlock onClick={(event: MouseEvent<HTMLDivElement>) => copyAddress(event)}>
          <Text
            size='16px'
            color='white'
            weight={600}
            lineHeight='150%'
            style={{ marginRight: '9px' }}
          >
            {account.label ? (
              <FormattedMessage
                id={`plugin.switch.account.label.${account.label}`}
                defaultMessage={account.label}
              />
            ) : (
              <FormattedMessage
                id='plugin.switch.account.private_key_wallet'
                defaultMessage='Private Key Wallet'
              />
            )}
          </Text>
          <IconCopy width={16} height={16} />
        </WalletBlock>
        <Flex>
          <FiatDisplay color='grey400' size='12px' weight={500} coin={account.coin}>
            {balance}
          </FiatDisplay>
          <CoinTextBlock color='grey400' size='12px' weight={500}>
            &nbsp;(
            <CoinDisplay coin={account.coin} color='grey400' size='12px' weight={500}>
              {balance}
            </CoinDisplay>
            )
          </CoinTextBlock>
        </Flex>
      </AccountInfo>
      {selectedAccountIndex === index ? (
        <ConnectBlock>
          <IconCheckWrapper height='24px' width='24px' />
          <Tooltip
            tooltipProperties={changeTooltipProperties(
              'white',
              index,
              70,
              65,
              'Connected!',
              'black'
            )}
          />
        </ConnectBlock>
      ) : (
        <ConnectBlock>
          <IconUncheckCircle />
          <Tooltip
            tooltipProperties={changeTooltipProperties(
              'black',
              index,
              50,
              50,
              'Connect',
              'grey400'
            )}
          />
        </ConnectBlock>
      )}
    </AccountBlock>
  )
}

const mapStateToProps = (state, props) => ({
  addressR: selectors.components.request.getNextAddress(state, props.account)
})

const mapDispatchToProps = (dispatch) => ({
  requestActions: bindActionCreators(actions.components.request, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Account)
