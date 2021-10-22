import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import { Props } from '..'

const InfoWrapper = styled.div`
  width: 100%;
  text-align: left;
  ${media.mobile`
  text-align: center;`}
`
const DeviceInfoWrapper = styled.div`
  margin-top: 20px;
`
const DeviceInfoHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  ${media.mobile`
  justify-content: center;`}
`
const DeviceDiff = styled.div`
  margin-top: 10px;
`
const DeviceInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0px;
  align-items: center;
  margin-top: 5px;
  ${media.mobile` 
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
`}
`
const DeviceInfoTitleRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
const OrText = styled(Text)`
  visibility: visible;
  ${media.mobile` 
  visibility: hidden;
`}
`
const ApproveWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
  > div:nth-child(2) {
    margin: 0px 5px;
  }
  ${media.mobile` 
  flex-direction: column;
`}
`
const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ApproveRejectButtons = styled(Button)`
  margin: 8px;
  ${media.mobile` 
  margin: 0;
`}
`

const SuccessWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Success = (props) => {
  const { approver, requester } = props
  return props.deviceAuthorized ? (
    <SuccessWrapper>
      <Icon color='success' name='checkmark-circle-filled' size='40px' />

      <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
        <FormattedMessage
          id='scenes.login.device_verified'
          defaultMessage='Your device is verified!'
        />
      </Text>

      <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
        <FormattedMessage
          id='scenes.login.device_verified.copy'
          defaultMessage='Return to previous browser to continue logging in.'
        />
      </Text>
    </SuccessWrapper>
  ) : (
    <>
      <FormBody>
        <Image name='blockchain-icon' width='40px' height='40px' />
        <Text size='20px' weight={600} color='grey900' style={{ marginTop: '24px' }}>
          <FormattedMessage id='copy.verifyyourdevice' defaultMessage='Verify Your Device' />
        </Text>
        <Text color='grey700' style={{ marginTop: '8px' }} size='16px' weight={500}>
          <FormattedMessage
            id='scenes.login.verify_device.header'
            defaultMessage='We noticed a login attempt recently from a different browser or device. If this was you, verify the login device.'
          />
        </Text>
      </FormBody>
      <ApproveWrapper>
        <ApproveRejectButtons
          data-e2e='approveLogin'
          nature='warning'
          onClick={props.authActions.authorizeVerifyDevice}
        >
          <FormattedMessage id='modals.mobilenumberverify.verify' defaultMessage='Verify' />
        </ApproveRejectButtons>
        <OrText size='12px' weight={400}>
          <FormattedMessage id='copy.or' defaultMessage='or' />
        </OrText>
        <ApproveRejectButtons
          data-e2e='rejectLogin'
          nature='primary'
          // onClick={props.onReject}
        >
          <FormattedMessage id='scenes.authorizelogin.reject' defaultMessage='Reject' />
        </ApproveRejectButtons>
      </ApproveWrapper>
    </>
  )
}

export default Success
