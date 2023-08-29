import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Exchange } from '@core'
import { ImportedAddrType } from '@core/types'
import {
  Button,
  HeartbeatLoader,
  Modal,
  ModalBody,
  ModalHeader,
  SpinningLoader,
  Text
} from 'blockchain-info-components'
import { Analytics, ModalName } from 'data/types'
import { CoinIcon } from 'layouts/Wallet/components'

import { Props as OwnProps } from '.'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin: 20px 0 10px;
  border: 1px solid ${(props) => props.theme.grey200};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
`

const IconRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & > :first-child {
    margin-right: 4px;
  }
`

const Body = styled(ModalBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 24px 0 24px;
`

const RecommendedImportedSweep = (props: Props) => {
  const {
    bchAddressHasBalance,
    bchLoading,
    btcAddressHasBalance,
    btcLoading,
    position,
    sweepSuccess,
    total
  } = props

  useEffect(() => {
    props.analyticsActions.trackEvent({
      key: Analytics.TRANSFER_FUNDS_MODAL_SHOWN,
      properties: {}
    })
  }, [])
  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <FormattedMessage id='modals.securitynotice.title' defaultMessage='Security Notice' />
      </ModalHeader>
      {(btcLoading || bchLoading) && (
        <Body>
          <SpinningLoader />
        </Body>
      )}
      {sweepSuccess && (
        <ModalBody>
          <Text size='16px' weight={400} lineHeight='1.5' style={{ marginBottom: '16px' }}>
            <FormattedMessage
              id='modals.success.body'
              defaultMessage='All funds held in legacy addresses have been successfully transferred to new, secure addresses in your DeFi Wallet.'
            />
          </Text>
          <Button
            data-e2e='upToDateThanks'
            nature='primary'
            fullwidth
            onClick={() => props.modalActions.closeModal(ModalName.RECOMMENDED_IMPORTED_SWEEP)}
          >
            <FormattedMessage id='modals.uptodate.thanks' defaultMessage='Thanks!' />
          </Button>
        </ModalBody>
      )}
      {!btcLoading && !bchLoading && !sweepSuccess && (
        <ModalBody>
          <Text size='14px' weight={400} lineHeight='1.5'>
            <FormattedMessage
              id='modals.securitynotice.para1'
              defaultMessage='The following legacy addresses have been identified as likely to be vulnerable to a security issue. To secure these funds, click the ‘Transfer Funds’ button below. This will move the funds from the legacy addresses into new, secure addresses in your DeFi wallet.'
            />
          </Text>
          <Container>
            {/* {btcAddressHasBalance && (
                    <Row style={{ marginBottom: '8px' }}>
                      <Text>
                        <FormattedMessage
                          id='modals.recommendedsweep.btcaddress'
                          defaultMessage='BTC'
                        />
                      </Text>

                      <Text>
                        {' '}
                        <FormattedMessage id='copy.balance' defaultMessage='Balance' />
                      </Text>
                    </Row>
                  )} */}
            {btcAddressHasBalance?.map((addr) => (
              <Row key={addr.addr} style={{ marginBottom: '8px' }}>
                <IconRow>
                  <CoinIcon name='BTC' size='16px' />
                  <Text size='14px' weight={500}>
                    {addr.addr}
                  </Text>
                </IconRow>
                <Text size='14px' weight={400}>
                  {Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: 'BTC',
                    value: addr.info.final_balance
                  })}{' '}
                  BTC
                </Text>
              </Row>
            ))}
            {/* {bchAddressHasBalance && (
                    <Row style={{ marginBottom: '8px' }}>
                      <Text>
                        <FormattedMessage
                          id='modals.recommendedsweep.bchaddress'
                          defaultMessage='BCH'
                        />
                      </Text>
                      <Text>
                        {' '}
                        <FormattedMessage id='copy.balance' defaultMessage='Balance' />
                      </Text>
                    </Row>
                  )} */}
            {bchAddressHasBalance?.map((addr) => (
              <Row key={addr.addr} style={{ marginBottom: '8px' }}>
                <IconRow>
                  <CoinIcon name='BCH' size='16px' />
                  <Text size='14px' weight={500}>
                    {addr.addr}
                  </Text>
                </IconRow>
                <Text size='14px' weight={400}>
                  {Exchange.convertCoinToCoin({
                    baseToStandard: true,
                    coin: 'BCH',
                    value: addr.info.final_balance
                  })}{' '}
                  BCH
                </Text>
              </Row>
            ))}
          </Container>
          <Button
            data-e2e='recommendedSweepSubmit'
            nature='primary'
            fullwidth
            onClick={props.handleSubmit}
            disabled={props.btcLoading || props.bchLoading}
          >
            {props.btcLoading || props.bchLoading ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <FormattedMessage id='modals.transfereth.confirm1' defaultMessage='Transfer Funds' />
            )}
          </Button>
        </ModalBody>
      )}
    </Modal>
  )
}

type Props = {
  bchAddressHasBalance?: ImportedAddrType[]
  bchLoading: boolean
  btcAddressHasBalance?: ImportedAddrType[]
  btcLoading: boolean
  handleSubmit: () => void
  position: number
  total: number
} & OwnProps

export default RecommendedImportedSweep
