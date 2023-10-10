import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

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
import CoinBalanceDisplay from 'components/CoinWithBalance/CoinBalanceDisplay'
import { Analytics, ImportedBtcAddressList, ModalName } from 'data/types'
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
              id='modals.securitynotice.success.body'
              defaultMessage='All funds held in legacy addresses have been successfully transferred to new addresses in your DeFi Wallet. Please discontinue the use of the legacy addresses in your wallet for receiving funds. Should you receive funds into these addresses in the future, you will be prompted again to transfer them to a new, secure address. You can now continue using your wallet normally.'
            />
          </Text>
          <Button
            data-e2e='upToDateThanks'
            nature='primary'
            fullwidth
            onClick={() => props.modalActions.closeModal(ModalName.RECOMMENDED_IMPORTED_SWEEP)}
          >
            <FormattedMessage id='modals.securitynotice.uptodate.thanks' defaultMessage='Thanks!' />
          </Button>
        </ModalBody>
      )}
      {!btcLoading && !bchLoading && !sweepSuccess && (
        <ModalBody>
          <Text size='14px' weight={400} lineHeight='1.5'>
            <FormattedMessage
              id='modals.securitynotice.para1'
              defaultMessage='The following legacy addresses have been identified as possibly affected by a third party software security issue. To secure these funds, click the ‘Transfer Funds’ button below. This will move the funds from the legacy addresses into new, secure addresses in your DeFi Wallet.'
            />
          </Text>
          <Container>
            {btcAddressHasBalance?.map((addr) => (
              <Row key={addr.address} style={{ marginBottom: '12px' }}>
                <IconRow>
                  <CoinIcon name='BTC' size='16px' />
                  <Text size='14px' weight={500}>
                    {addr.address}
                  </Text>
                </IconRow>
                <CoinBalanceDisplay coin='BTC' balance={addr.balance} />
              </Row>
            ))}

            {bchAddressHasBalance?.map((addr) => (
              <Row key={addr.addr} style={{ marginBottom: '8px' }}>
                <IconRow>
                  <CoinIcon name='BCH' size='16px' />
                  <Text size='14px' weight={500}>
                    {addr.addr}
                  </Text>
                </IconRow>
                <CoinBalanceDisplay coin='BCH' balance={addr.info.final_balance} />
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
  btcAddressHasBalance?: ImportedBtcAddressList
  btcLoading: boolean
  handleSubmit: () => void
  position: number
  sweepSuccess: boolean | string
  total: number
} & OwnProps

export default RecommendedImportedSweep
