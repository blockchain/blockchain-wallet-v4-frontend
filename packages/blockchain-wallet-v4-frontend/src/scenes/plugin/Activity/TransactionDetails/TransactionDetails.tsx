import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { EthProcessedTxType } from '@core/transactions/types'
import { convertGweiToWei } from '@core/utils/eth'
import { Button, Link, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import Tooltip from '../../SwitchAccount/Tooltip'
import TransactionIcon from '../TransactionIcon/TransactionIcon'
import StatusBadge from './StatusBadge'
import TransactionDetailsItem from './TransactionDetailsItem'

interface ITransactionDetailsProps {
  coin: string
  onClose(): void
  status: 'CONFIRMED' | 'PENDING'
  transaction: EthProcessedTxType
}

const Wrapper = styled(Flex)`
  height: 100%;
  overflow: auto;
`

const IconWrapper = styled(Flex)`
  cursor: pointer;
`

const ButtonWrapper = styled.div`
  display: grid;
`

const TooltipWrapper = styled.div<{ isVisible: boolean }>`
  position: relative;
  #tooltip {
    display: ${(props) => (props.isVisible ? 'block' : 'none')};
  }
`

const getTransactionLinkInEthExplorer = (hash: string) =>
  `https://www.blockchain.com/eth/tx/${hash}`

const TransactionDetails: React.FC<ITransactionDetailsProps> = ({
  coin,
  onClose,
  status,
  transaction
}) => {
  const [toastItemVisible, setToastItemVisible] = React.useState<string | null>(null)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleBackClick = () => {
    onClose()
  }

  const handleChangeToastVisible = (item: string) => {
    setToastItemVisible(item)

    if (timerRef.current) {
      timerRef.current = setTimeout(() => {
        setToastItemVisible(null)
      }, 2000)
    }
  }

  const handleSpeedUpClick = () => {}

  const handleCopyToClipboard = () => {
    if (!navigator.clipboard) {
      return
    }
    navigator.clipboard.writeText(transaction.hash).then(() => {
      handleChangeToastVisible('txId')
    })
  }

  return (
    <Wrapper flexDirection='column'>
      <Padding bottom={34}>
        <IconWrapper>
          <Icon label='go-back' size='md' color='grey600'>
            <IconArrowLeft onClick={handleBackClick} />
          </Icon>
        </IconWrapper>
      </Padding>

      <Padding bottom={26}>
        <Text size='20px' lineHeight='30px' color='white' weight={700}>
          <FormattedMessage
            id={`plugin.activity.transactionDetails.${transaction.type}`}
            defaultMessage={
              transaction.type === 'sent'
                ? 'Send'
                : transaction.type === 'received'
                ? 'Receive'
                : ''
            }
          />{' '}
          {coin}
        </Text>
      </Padding>

      <Padding bottom={14}>
        <Flex justifyContent='space-between'>
          <Text size='16px' lineHeight='24px' color='white' weight={600}>
            <FormattedMessage
              id='plugin.activity.transactionDetails.status'
              defaultMessage='Status'
            />
          </Text>

          <StatusBadge status={status} />
        </Flex>
      </Padding>

      <Padding bottom={5}>
        <Link
          size='12px'
          target='_blank'
          rel='noopener noreferrer'
          href={getTransactionLinkInEthExplorer(transaction.hash)}
        >
          <FormattedMessage
            id='plugin.activity.transactionDetails.viewInExplorer'
            defaultMessage='View on Blockchain Explorer'
          />
        </Link>
      </Padding>

      <Link size='12px' onClick={handleCopyToClipboard}>
        <TooltipWrapper isVisible={toastItemVisible === 'txId'}>
          <Tooltip
            tooltipProperties={{
              backgroundColor: 'white',
              index: 1,
              leftBlockPosition: 10,
              leftTrianglePosition: 50,
              text: 'Copied!',
              textColor: 'black'
            }}
          />
        </TooltipWrapper>
        <FormattedMessage
          id='plugin.activity.transactionDetails.copyId'
          defaultMessage='Copy transaction ID'
        />
      </Link>

      <Padding top={43} bottom={40}>
        <Flex justifyContent='space-between' alignItems='center'>
          <Flex flexDirection='column'>
            <Padding bottom={7}>
              <Text size='14px' lineHeight='21px' color='grey400' weight={500}>
                <FormattedMessage
                  id='plugin.activity.transactionDetails.from'
                  defaultMessage='From'
                />
              </Text>
            </Padding>
            <Text size='14px' lineHeight='21px' color='white' weight={500}>
              <TooltipWrapper isVisible={toastItemVisible === 'from'}>
                <Tooltip
                  tooltipProperties={{
                    backgroundColor: 'white',
                    index: 1,
                    leftBlockPosition: 70,
                    leftTrianglePosition: 50,
                    text: 'Copied!',
                    textColor: 'black'
                  }}
                />
              </TooltipWrapper>

              <CryptoAddress canCopy onCopySuccess={() => handleChangeToastVisible('from')}>
                {transaction.from}
              </CryptoAddress>
            </Text>
          </Flex>

          <TransactionIcon type={transaction.type} />

          <Flex flexDirection='column'>
            <Padding bottom={7}>
              <Text size='12px' lineHeight='21px' color='grey400' weight={500}>
                <FormattedMessage
                  id='plugin.activity.transactionDetails.from'
                  defaultMessage='To'
                />
              </Text>
            </Padding>

            <Text size='14px' lineHeight='21px' color='white' weight={500}>
              <TooltipWrapper isVisible={toastItemVisible === 'to'}>
                <Tooltip
                  tooltipProperties={{
                    backgroundColor: 'white',
                    index: 1,
                    leftBlockPosition: 70,
                    leftTrianglePosition: 50,
                    text: 'Copied!',
                    textColor: 'black'
                  }}
                />
              </TooltipWrapper>

              <CryptoAddress canCopy onCopySuccess={() => handleChangeToastVisible('to')}>
                {transaction.to}
              </CryptoAddress>
            </Text>
          </Flex>
        </Flex>
      </Padding>

      <Padding bottom={16}>
        <Text size='16px' lineHeight='24px' color='white' weight={600}>
          <FormattedMessage
            id='plugin.activity.transactionDetails.transaction'
            defaultMessage='Transaction'
          />
        </Text>
      </Padding>

      <Flex flexDirection='column' gap={16}>
        <TransactionDetailsItem
          label={
            <FormattedMessage
              id='plugin.activity.transactionDetails.nonce'
              defaultMessage='Nonce'
            />
          }
          value={
            <Text size='14px' lineHeight='21px' color='white' weight={500}>
              {transaction.nonce}
            </Text>
          }
        />
        <TransactionDetailsItem
          label={
            <FormattedMessage
              id='plugin.activity.transactionDetails.amount'
              defaultMessage='Amount'
            />
          }
          value={
            <CoinDisplay size='14px' lineHeight='21px' weight={500} color='white' coin={coin}>
              {transaction.amount}
            </CoinDisplay>
          }
        />
        <TransactionDetailsItem
          label={
            <FormattedMessage
              id='plugin.activity.transactionDetails.gasFee'
              defaultMessage='Gas Fee'
            />
          }
          value={
            <CoinDisplay size='14px' lineHeight='21px' weight={500} color='white' coin={coin}>
              {convertGweiToWei(transaction.gasPrice)}
            </CoinDisplay>
          }
        />
        <TransactionDetailsItem
          label={
            <FormattedMessage
              id='plugin.activity.transactionDetails.gasFee'
              defaultMessage='Gas Limit'
            />
          }
          value={
            <CoinDisplay size='14px' lineHeight='21px' weight={500} color='white' coin={coin}>
              {convertGweiToWei(transaction.gasLimit)}
            </CoinDisplay>
          }
        />
        <TransactionDetailsItem
          label={
            <FormattedMessage
              id='plugin.activity.transactionDetails.totalGasFee'
              defaultMessage='Total Gas Fee'
            />
          }
          value={
            <CoinDisplay size='14px' lineHeight='21px' weight={500} color='white' coin={coin}>
              {new BigNumber(transaction.gasPrice)
                .multipliedBy(new BigNumber(transaction.gasLimit))
                .toString()}
            </CoinDisplay>
          }
        />
        <TransactionDetailsItem
          label={
            <FormattedMessage
              id='plugin.activity.transactionDetails.total'
              defaultMessage='Total'
            />
          }
          value={
            <CoinDisplay size='14px' lineHeight='21px' weight={500} color='white' coin={coin}>
              {new BigNumber(transaction.gasPrice)
                .multipliedBy(new BigNumber(transaction.gasLimit))
                .plus(transaction.amount)
                .toString()}
            </CoinDisplay>
          }
          subValue={
            <FiatDisplay size='12px' lineHeight='18px' color='grey400' weight={500} coin={coin}>
              {new BigNumber(transaction.gasPrice)
                .multipliedBy(new BigNumber(transaction.gasLimit))
                .plus(transaction.amount)
                .toString()}
            </FiatDisplay>
          }
        />
        <TransactionDetailsItem
          label={
            <FormattedMessage id='plugin.activity.transactionDetails.time' defaultMessage='Time' />
          }
          value={
            <Text size='14px' lineHeight='21px' color='white' weight={500}>
              {transaction.timeFormatted}
            </Text>
          }
        />
      </Flex>

      {status === 'CONFIRMED' && (
        <Padding bottom={24} top={33}>
          <ButtonWrapper>
            <Button
              height='48px'
              data-e2e='transaction-details-go-back-button'
              onClick={handleBackClick}
            >
              <FormattedMessage
                id='plugin.activity.transactionDetails.goBack'
                defaultMessage='Go Back'
              />
            </Button>
          </ButtonWrapper>
        </Padding>
      )}

      {status === 'PENDING' && (
        <Padding bottom={24} top={33}>
          <ButtonWrapper>
            <Button
              height='48px'
              data-e2e='transaction-details-speed-up-button'
              onClick={handleSpeedUpClick}
            >
              <FormattedMessage
                id='plugin.activity.transactionDetails.goBack'
                defaultMessage='Speed up'
              />
            </Button>
          </ButtonWrapper>
        </Padding>
      )}
    </Wrapper>
  )
}

export default TransactionDetails
