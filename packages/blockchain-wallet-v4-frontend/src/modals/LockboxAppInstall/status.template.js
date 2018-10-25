import React from 'react'
import styled from 'styled-components'
import { FormattedHTMLMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'
import { RotateSync } from 'components/RotateSync'

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`
const Result = styled.div`
  display: flex;
  & > :last-child {
    margin-left: 5px;
  }
`
const RotateSyncIcon = styled(RotateSync)`
  margin-right: 18px;
`
const CoinInstallStatus = props => {
  const { coin, status } = props

  return (
    <Row>
      <Text size='16px' weight={300}>
        {coin}
      </Text>
      {status.waiting && (
        <Text size='14px' weight={300}>
          <FormattedHTMLMessage
            id='modals.lockboxappinstall.pending'
            defaultMessage='Pending'
          />
        </Text>
      )}
      {status.busy && <RotateSyncIcon size='15px' />}
      {status.error && (
        <Result>
          <Icon name='alert-filled' size='18px' color='brand-yellow' />
          <Text size='14px' weight={300}>
            {status.error()}
          </Text>
        </Result>
      )}
      {status.success && (
        <Result>
          <Icon name='checkmark-in-circle-filled' size='18px' color='success' />
          <Text size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxappinstall.success'
              defaultMessage='Success'
            />
          </Text>
        </Result>
      )}
    </Row>
  )
}

export default CoinInstallStatus
