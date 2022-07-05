import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Banner, Button, Icon, Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { media } from 'services/styles'

import { Props } from '..'
import { LoginWrapper } from '../model'

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
    <LoginWrapper>
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
    </LoginWrapper>
  ) : (
    <LoginWrapper>
      <FormBody>
        <Image name='blockchain-icon' width='40px' height='40px' />
        <Text size='20px' weight={600} color='grey900' style={{ marginTop: '24px' }}>
          <FormattedMessage id='copy.verifyyourdevice' defaultMessage='Verify Your Device' />
        </Text>
        <Text color='grey700' style={{ marginTop: '8px' }} size='16px' weight={400}>
          <FormattedMessage
            id='scenes.login.verify_device.header'
            defaultMessage='We noticed a login attempt recently from a different browser or device. If this was you, verify the login device.'
          />
        </Text>
      </FormBody>
      <DeviceInfoWrapper>
        <DeviceInfoHeader>
          <Text size='16px' weight={500} color='success'>
            <FormattedMessage id='scenes.authorizelogin.yourdevice' defaultMessage='Your Device' />
          </Text>
          &nbsp;
          <Text size='16px' weight={500} color='grey700'>
            <FormattedMessage id='scenes.authorizelogin.vs' defaultMessage='vs.' />
          </Text>
          &nbsp;
          <Text size='16px' weight={500} color='error'>
            <FormattedMessage
              id='scenes.authorizelogin.requestingdevice'
              defaultMessage='Requesting Device'
            />
          </Text>
        </DeviceInfoHeader>
        <DeviceDiff>
          <DeviceInfoRow>
            <DeviceInfoTitleRow>
              {/* eslint-disable */}
              {approver.browser === requester.browser ? (
                <Icon name='checkmark-circle-filled' color='success' size='16px' />
              ) : (
                <Icon
                  name='close-circle'
                  color='error'
                  size='20px'
                  style={{ marginLeft: '-2px', marginRight: '-2px' }}
                />
              )}
              &nbsp;
              <Text size='14px' style={{ paddingLeft: '6px' }}>
                <FormattedMessage id='scenes.authorizelogin.browser' defaultMessage='Browser: ' />
              </Text>
            </DeviceInfoTitleRow>
            <Banner type='success' inline>
              {approver.browser}
            </Banner>
            {approver.browser !== requester.browser && (
              <Banner type='warning' inline>
                {requester.browser}
              </Banner>
            )}
            {/* eslint-enable */}
          </DeviceInfoRow>
          <DeviceInfoRow>
            <DeviceInfoTitleRow>
              {/* eslint-disable */}
              {approver.ip_address === requester.ip_address ? (
                <Icon name='checkmark-circle-filled' color='success' size='16px' />
              ) : (
                <Icon
                  name='close-circle'
                  color='error'
                  size='20px'
                  style={{ marginLeft: '-2px', marginRight: '-2px' }}
                />
              )}
              &nbsp;
              <Text size='14px' style={{ paddingLeft: '6px' }}>
                <FormattedMessage
                  id='scenes.authorizelogin.ipaddress'
                  defaultMessage='IP Address: '
                />
              </Text>
            </DeviceInfoTitleRow>
            <Banner type='success' inline>
              {approver.ip_address}
            </Banner>
            {approver.ip_address !== requester.ip_address && (
              <Banner type='warning' inline>
                {requester.ip_address}
              </Banner>
            )}
            {/* eslint-enable */}
          </DeviceInfoRow>
          <DeviceInfoRow>
            <DeviceInfoTitleRow>
              {/* eslint-disable */}
              {approver.country_name === requester.country_name ? (
                <Icon name='checkmark-circle-filled' color='success' size='16px' />
              ) : (
                <Icon
                  name='close-circle'
                  color='error'
                  size='20px'
                  style={{ marginLeft: '-2px', marginRight: '-2px' }}
                />
              )}
              &nbsp;
              <Text size='14px' style={{ paddingLeft: '6px' }}>
                <FormattedMessage
                  id='scenes.authorizelogin.country'
                  defaultMessage='Country of Origin: '
                />
              </Text>
            </DeviceInfoTitleRow>
            <Banner type='success' inline>
              {approver.country_name}
            </Banner>
            {approver.country_name !== requester.country_name && (
              <Banner type='warning' inline>
                {requester.country_name}
              </Banner>
            )}
            {/* eslint-enable */}
          </DeviceInfoRow>
        </DeviceDiff>
      </DeviceInfoWrapper>
      <ApproveWrapper>
        <ApproveRejectButtons
          data-e2e='approveLogin'
          nature='warning'
          onClick={() => props.authActions.authorizeVerifyDevice(true)}
        >
          <FormattedMessage id='modals.mobilenumberverify.verify' defaultMessage='Verify' />
        </ApproveRejectButtons>
        <OrText size='12px' weight={400}>
          <FormattedMessage id='copy.or' defaultMessage='or' />
        </OrText>
        <ApproveRejectButtons
          data-e2e='rejectLogin'
          nature='primary'
          onClick={() => props.authActions.authorizeVerifyDevice(false)}
        >
          <FormattedMessage id='scenes.authorizelogin.reject' defaultMessage='Reject' />
        </ApproveRejectButtons>
      </ApproveWrapper>
    </LoginWrapper>
  )
}

export default Success
