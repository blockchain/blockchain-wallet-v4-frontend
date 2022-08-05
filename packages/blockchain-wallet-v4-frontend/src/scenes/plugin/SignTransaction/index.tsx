/* eslint-disable  max-classes-per-file */
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconAlert, IconBlockchainCircle } from '@blockchain-com/icons'
import { useQueryTransactionRequestPameters } from 'blockchain-wallet-v4-frontend/src/hooks/useQueryTransactionRequestPameters'
import { BigNumberish, BytesLike, ethers, providers } from 'ethers'
import { TabMetadata } from 'plugin/internal'
import { ConnectionEvents } from 'plugin/provider/types'
import { SupportedRPCMethods } from 'plugin/provider/utils'
import { CombinedState } from 'redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 19px;
`

const SiteIconContainer = styled('div')`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  overflow: auto;
`

const SiteIcon = styled('img')`
  width: 100%;
`

const BlockchainIcon = styled(IconBlockchainCircle)`
  color: ${(props) => props.theme.white};
`

const Title = styled(Text)`
  margin: 19px auto 12px;
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: center;
  color: ${(props) => props.theme.white};
`

const TransactionData = styled(Text)`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
`

const Origin = styled(TransactionData)`
  margin-bottom: 73px;
  text-align: center;
`

const Subtitle = styled(Text)`
  margin-bottom: 7px;
  width: 100%;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
`

const Fees = styled(Flex)`
  margin-top: 43px;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
`

const FeesLabel = styled(Flex)`
  justify-content: center;
  align-items: center;
  gap: 5px;
`

const FeesSubtitle = styled(Subtitle)`
  margin-bottom: 0;
`

const FeesAmount = styled(Flex)`
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
`
const FeesData = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: right;
`

const ButtonsWrapper = styled(Flex)`
  flex-grow: 1;
  width: 100%;
  justify-content: center;
  align-items: flex-end;
`

class Transaction implements providers.TransactionRequest {
  /* eslint-disable no-useless-constructor */
  constructor(
    public to: string = '',
    public from: string = '',
    public nonce: BigNumberish = '',
    public gasLimit: BigNumberish = '',
    public gasPrice: BigNumberish = '',
    public data: BytesLike = '',
    public value: BigNumberish = '',
    public chainId: number = 0
  ) {}
}

class FeeState {
  constructor(
    public gasPrice: BigNumberish = '',
    public maxFeePerGas: BigNumberish = '',
    public maxPriorityFeePerGas: BigNumberish = ''
  ) {}
}

const AcceptButton = styled.button`
  height: 48px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
`

const DenyButton = styled(AcceptButton)`
  background-color: transparent;
  color: ${(props) => props.theme.white};
`

const SignTransaction = (props) => {
  const dispatch = useDispatch()
  const [metadata, setMetedata] = useState<TabMetadata>({ origin: '' })
  const [fees, setFees] = useState<FeeState>(new FeeState())
  const [transactionRequest, setTransactionRequest] = useState<Transaction>(new Transaction())

  const queryTransactionRequestParameters = useQueryTransactionRequestPameters(
    props.history.location.search
  )
  const signer = useSelector((state: CombinedState<any>) =>
    selectors.components.plugin.getWallet(state)
  )

  const accept = async () => {
    const transactionParams = { ...transactionRequest }
    /* eslint-disable */
    for (let key in transactionParams) {
      if (!transactionParams[key]) {
        delete transactionParams[key]
      } else if (key === 'gasPrice' || key === 'gasLimit' || key === 'value') {
        transactionParams[key] = ethers.utils.parseEther(String(transactionParams[key]))
      }
    }

    try {
      const signedTransaction = await signer?.signTransaction(transactionParams)
      await chrome.runtime.sendMessage({
        data: signedTransaction,
        type: SupportedRPCMethods.SignTransaction
      })
    } catch (e) {
      await chrome.runtime.sendMessage({
        data: e.message,
        type: ConnectionEvents.Error
      })
    }
    window.close()
  }

  const deny = () => {
    window.onbeforeunload = () => {
      chrome.runtime.sendMessage({
        data: null,
        type: SupportedRPCMethods.SignTransaction
      })
    }
    window.close()
  }

  const getSlicedAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-4)}`
  }

  useEffect(() => {
    const params = new URLSearchParams(props.history.location.search)
    setMetedata({
      favicon: params.get('favicon') || '',
      origin: params.get('domain') || ''
    })
  }, [props.history.location.search])

  useEffect(() => {
    queryTransactionRequestParameters &&  setTransactionRequest(queryTransactionRequestParameters)
  }, [queryTransactionRequestParameters])

  useEffect(() => {
    dispatch(actions.components.plugin.getWallet())
    window.onbeforeunload = () => {
      chrome.runtime.sendMessage({
        data: null,
        type: SupportedRPCMethods.SignTransaction
      })
    }
  }, [])

  useEffect(() => {
    if (!signer) return
    (async () => {
      const fees = await signer.getFeeData()
      const defaultValue = ethers.BigNumber.from(0)
      setFees(
        new FeeState(
          transactionRequest.gasPrice ? transactionRequest.gasPrice : ethers.utils.formatEther(fees.gasPrice || defaultValue),
          ethers.utils.formatEther(fees.maxFeePerGas || defaultValue),
          ethers.utils.formatEther(fees.maxPriorityFeePerGas || defaultValue),
        ));
    })()
  }, [signer])

  return (
    <Wrapper>
      {metadata.favicon ? (
        <SiteIconContainer>
          <SiteIcon src={metadata.favicon} alt='icon' />
        </SiteIconContainer>
      ) : (
        <BlockchainIcon width='78px' height='78px' />
      )}
      <Title>
        <FormattedMessage
          id='scenes.plugin.sign_transaction.heading'
          defaultMessage='Sign transaction'
        />
      </Title>
      <Origin>{metadata.origin}</Origin>
      <Subtitle>
        <FormattedMessage id='scenes.plugin.sign_transaction.to' defaultMessage='To account' />
      </Subtitle>
      <TransactionData color='white'>{getSlicedAddress(transactionRequest.to)}</TransactionData>
      <TransactionData>{`${transactionRequest.value} ETH`}</TransactionData>
      <Fees>
        <FeesLabel>
          <FeesSubtitle>
            <FormattedMessage id='scenes.plugin.sign_transaction.fee' defaultMessage='Fee' />
          </FeesSubtitle>
          <Icon color='grey700' label='IconBack' size='md'>
            <IconAlert width={'12px'} height={'12px'} />
          </Icon>
        </FeesLabel>
        <FeesAmount>
          <FeesData color='white'>{`${fees.gasPrice} ETH`}</FeesData>
          <FeesData size='14px'>{`0.1 USD`}</FeesData>
        </FeesAmount>
      </Fees>
      <ButtonsWrapper >
        <DenyButton onClick={deny}>
          <FormattedMessage id='scenes.plugin.settings.connect_dapp.deny' defaultMessage='Deny' />
        </DenyButton>
        <AcceptButton onClick={accept}>
          <FormattedMessage
            id='scenes.plugin.sign_transaction.sign'
            defaultMessage='Sign'
          />
        </AcceptButton>
      </ButtonsWrapper>
    </Wrapper >
  )
}

export default SignTransaction
