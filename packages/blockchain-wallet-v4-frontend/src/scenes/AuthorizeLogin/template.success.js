import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Banner, Button, Icon, Image, Text } from 'blockchain-info-components'

const Fragment = React.Fragment

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`
const InfoWrapper = styled.div`
  text-align: left;
`
const DeviceInfoWrapper = styled.div`
  margin-top: 20px;
`
const DeviceInfoHeader = styled.div`
  display: flex;
  flex-direction: row;
`
const DeviceDiff = styled.div`
  margin-top: 10px;
`
const DeviceInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`
const ApproveWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  > div:nth-child(2) {
    margin: 0px 5px;
  }
`

const Success = props => {
  /* eslint-disable */
  const { approver_device_description, requester_device_description } = props.value
  const { approver_country, requester_country } = props.value
  const { approver_ip, requester_ip } = props.value
  const requestDenied = props.value['request-denied']
  /* eslint-enable */

  return (
    <Wrapper>
      { props.value.device_change_reason ? <Fragment>
        <Image name='blue-logo' width='50px' height='50px' />
        <InfoWrapper>
          <Text size='24px' weight={400} color='gray-5' style={{ 'margin-top': '25px' }}>
            <FormattedMessage id='scenes.authorizelogin.attemptfrombrowser' defaultMessage='Login attempt from another browser' />
          </Text>
          <Text size='13px' weight={300} color='gray-5' style={{ 'margin-top': '10px' }}>
            <FormattedMessage id='scenes.authorizelogin.attemptfrombrowsermsg' defaultMessage='Someone, hopefully you, is attempting to login to your wallet from a different browser.' />
          </Text>
          <DeviceInfoWrapper>
            <DeviceInfoHeader>
              <Text size='16px' weight={400} color='success'>
                <FormattedMessage id='scenes.authorizelogin.vs' defaultMessage='Your Device' />
              </Text>
              &nbsp;
              <Text size='16px' weight={400} color='gray-5'>
                <FormattedMessage id='scenes.authorizelogin.vs' defaultMessage='vs.' />
              </Text>
              &nbsp;
              <Text size='16px' weight={400} color='error'>
                <FormattedMessage id='scenes.authorizelogin.requestingdevice' defaultMessage='Requesting Device' />
              </Text>
            </DeviceInfoHeader>
            <DeviceDiff>
              <DeviceInfoRow>
                {/* eslint-disable */}
                { approver_device_description === requester_device_description ? <Icon name='checkmark-in-circle-filled' color='success' size='13px' /> : <Icon name='close-filled' color='error' size='13px' /> }
                &nbsp;
                <Text size='14px'>
                  <FormattedMessage id='scenes.authorizelogin.browser' defaultMessage='Browser: ' />
                </Text>
                <Banner type='success' inline>{approver_device_description}</Banner>
                { approver_device_description !== requester_device_description && <Banner type='warning' inline>{requester_device_description}</Banner> }
                {/* eslint-enable */}
              </DeviceInfoRow>
              <DeviceInfoRow>
                {/* eslint-disable */}
                { approver_ip === requester_ip ? <Icon name='checkmark-in-circle-filled' color='success' size='13px' /> : <Icon name='close-filled' color='error' size='13px' /> }
                &nbsp;
                <Text size='14px'>
                  <FormattedMessage id='scenes.authorizelogin.browser' defaultMessage='IP Address: ' />
                </Text>
                <Banner type='success' inline>{approver_ip}</Banner>
                { approver_ip !== requester_ip && <Banner type='warning' inline>{requester_ip}</Banner> }
                {/* eslint-enable */}
              </DeviceInfoRow>
              <DeviceInfoRow>
                {/* eslint-disable */}
                { approver_country === requester_country ? <Icon name='checkmark-in-circle-filled' color='success' size='13px' /> : <Icon name='close-filled' color='error' size='13px' /> }
                &nbsp;
                <Text size='14px'>
                  <FormattedMessage id='scenes.authorizelogin.country' defaultMessage='Country of Origin: ' />
                </Text>
                <Banner type='success' inline>{approver_country}</Banner>
                { approver_country !== requester_country && <Banner type='warning' inline>{requester_country}</Banner> }
                {/* eslint-enable */}
              </DeviceInfoRow>
            </DeviceDiff>
          </DeviceInfoWrapper>
          <ApproveWrapper>
            <Button nature='logout' onClick={props.onAccept}>
              <FormattedMessage id='scenes.authorizelogin.accept' defaultMessage='Accept' />
            </Button>
            &nbsp;
            <Text size='12px' weight={300}>
              <FormattedMessage id='scenes.authorizelogin.or' defaultMessage='Or' />
            </Text>
            &nbsp;
            <Button nature='primary' onClick={props.onReject}>
              <FormattedMessage id='scenes.authorizelogin.reject' defaultMessage='Reject' />
            </Button>
          </ApproveWrapper>
        </InfoWrapper>
      </Fragment>
        : <Fragment>
          {
            requestDenied
              ? <Icon name='close-filled' color='error' size='40px' />
              : <Icon name='checkmark-in-circle' color='success' size='40px' />
          }
          <Text size='16px' weight={300} color='gray-5' style={{ 'margin-top': '25px' }}>
            {
              requestDenied
                ? <FormattedMessage id='scenes.authorizelogin.loading' defaultMessage='Login attempt rejected! Please contact our support team if you have any questions or concerns.' />
                : <FormattedMessage id='scenes.authorizelogin.loading' defaultMessage='Login approved! Please return to your previous tab to view your wallet.' />
            }
          </Text>
        </Fragment>
      }
    </Wrapper>
  )
}

export default Success
