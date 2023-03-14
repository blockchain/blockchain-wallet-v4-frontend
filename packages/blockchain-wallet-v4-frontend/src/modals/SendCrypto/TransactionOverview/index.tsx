import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { Button, SpinningLoader, Text } from 'blockchain-info-components'
import CollapseText from 'components/CollapseText'
import DataError from 'components/DataError'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { FlyoutWrapper, Row } from 'components/Flyout'
import { AmountWrapper, StepHeader } from 'components/Flyout/SendRequestCrypto'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Props as OwnProps } from '..'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  min-height: 100%;
`
const CustomRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:last-child * {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`

const TransactionOverview = (props: Props) => {
  const { formValues, showNewSendFlow } = props
  const { selectedAccount, to } = formValues
  const { coin } = selectedAccount

  return (
    <Wrapper>
      <FlyoutWrapper>
        <StepHeader>
          <Text size='24px' color='grey800' weight={600}>
            <FormattedMessage id='modals.sendcrypto.enteramount.title' defaultMessage='Send' />
          </Text>
        </StepHeader>
      </FlyoutWrapper>
      {props.prebuildTxR.cata({
        Failure: (e) => <DataError message={{ message: e }} />,
        Loading: () => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          </div>
        ),
        NotAsked: () => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          </div>
        ),
        Success: (tx) => (
          <>
            <AmountWrapper>
              <CoinDisplay coin={coin} size='32px' weight={600} color='black'>
                {new BigNumber(tx.summary.amount).plus(tx.summary.absoluteFeeEstimate)}
              </CoinDisplay>
            </AmountWrapper>
            <CustomRow>
              <div>
                <Text size='16px' weight={500} color='black'>
                  <FormattedMessage id='copy.send' defaultMessage='Send' />
                </Text>
              </div>
              <div>
                <CoinDisplay coin={coin} size='16px' weight={500} color='black'>
                  {tx.summary.amount}
                </CoinDisplay>
                <FiatDisplay coin={coin} size='14px' weight={500} color='grey500'>
                  {tx.summary.amount}
                </FiatDisplay>
              </div>
            </CustomRow>
            <CustomRow>
              <div>
                <Text size='16px' weight={500} color='black'>
                  <FormattedMessage id='copy.from' defaultMessage='From' />
                </Text>
              </div>
              <div>
                <Text size='16px' weight={500} color='black'>
                  {selectedAccount.label}
                </Text>
              </div>
            </CustomRow>
            <CustomRow>
              <div>
                <Text size='16px' weight={500} color='black'>
                  <FormattedMessage id='copy.to' defaultMessage='To' />
                </Text>
              </div>
              <div>
                <Text size='16px' weight={500} color='black'>
                  <CollapseText text={to} size='16px' color='black' weight={500} place='left' />
                </Text>
              </div>
            </CustomRow>
            <CustomRow>
              <div>
                <Text size='16px' weight={500} color='black'>
                  <FormattedMessage id='copy.fee' defaultMessage='Fee' />
                </Text>
              </div>
              <div>
                <CoinDisplay coin={coin} size='16px' weight={500} color='black'>
                  {tx.summary.absoluteFeeEstimate}
                </CoinDisplay>
                <FiatDisplay coin={coin} size='14px' weight={500} color='grey500'>
                  {tx.summary.absoluteFeeEstimate}
                </FiatDisplay>
              </div>
            </CustomRow>
            {tx.rawTx?.payload.payload.memo.content ? (
              <CustomRow>
                <div>
                  <Text size='16px' weight={500} color='black'>
                    <FormattedMessage id='copy.memo' defaultMessage='Memo' />
                  </Text>
                </div>
                <div>
                  <Text size='16px' weight={500} color='black'>
                    {tx.rawTx.payload.payload.memo.content}
                  </Text>
                </div>
              </CustomRow>
            ) : null}
            <CustomRow>
              <div>
                <Text size='16px' weight={600} color='black'>
                  <FormattedMessage id='copy.total' defaultMessage='Total' />
                </Text>
              </div>
              <div>
                <CoinDisplay coin={coin} size='16px' weight={600} color='black'>
                  {new BigNumber(tx.summary.amount).plus(tx.summary.absoluteFeeEstimate)}
                </CoinDisplay>
                <FiatDisplay coin={coin} size='14px' weight={600} color='grey500'>
                  {new BigNumber(tx.summary.amount).plus(tx.summary.absoluteFeeEstimate)}
                </FiatDisplay>
              </div>
            </CustomRow>

            <FlyoutWrapper>
              <Button data-e2e='sendBtn' nature='primary' jumbo fullwidth type='submit'>
                <FormattedMessage id='buttons.send' defaultMessage='Send' />
                &nbsp;
                <CoinDisplay coin={coin} size='16px' weight={600} color='white'>
                  {new BigNumber(tx.summary.amount).plus(tx.summary.absoluteFeeEstimate)}
                </CoinDisplay>
              </Button>

              {!showNewSendFlow && (
                <Button
                  style={{ marginTop: '16px' }}
                  data-e2e='cancelBtn'
                  nature='light-red'
                  jumbo
                  fullwidth
                  onClick={() => props.close()}
                >
                  <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
                </Button>
              )}
            </FlyoutWrapper>
          </>
        )
      })}
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  prebuildTxR: selectors.components.sendCrypto.getPrebuildTx(state),
  transaction: selectors.components.sendCrypto.getTransaction(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(TransactionOverview)
