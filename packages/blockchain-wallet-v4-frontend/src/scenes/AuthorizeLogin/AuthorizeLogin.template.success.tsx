import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Separator } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
`
const HeaderWrapper = styled.div`
  text-align: center;
  margin-bottom: 8px;

  & > div {
    margin-top: 8px;
  }
`
const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  > div {
    display: flex;
    align-items: center;
    flex: 0 1 33%;
    height: 64px;
    text-align: left;
  }
`
const ButtonsRow = styled.div`
  width: 100%;
  & > button {
    margin-top: 24px;
  }
`

const AuthorizeLogin = (props) => {
  const {
    approver_country,
    approver_device_description,
    approver_ip,
    device_change_reason,
    requester_country,
    requester_device_description,
    requester_ip
  } = props.value

  const requestDenied = props.value['request-denied']

  return (
    <Wrapper>
      {device_change_reason && (
        <>
          <Image name='blockchain-icon' width='40px' height='40px' />
          <HeaderWrapper>
            <Text lineHeight='30px' size='20px' weight={600} color='black'>
              <FormattedMessage
                id='scenes.authorizelogin.verifydevice'
                defaultMessage='Verify Your Device'
              />
            </Text>
            <Text color='black' size='16px' weight={500} lineHeight='24px'>
              <FormattedMessage
                id='scenes.authorizelogin.verify'
                defaultMessage='We noticed a login attempt recently originating from a different browser or device.  If this was you, verify the login attempt.'
              />
            </Text>
          </HeaderWrapper>
          <Row style={{ height: '48px' }}>
            <div />
            <div>
              <Text color='grey600' size='12px' weight={500} lineHeight='18px'>
                <FormattedMessage id='buttons.your_device' defaultMessage='Your Device' />
              </Text>
            </div>
            <div>
              <Text color='grey600' size='12px' weight={500} lineHeight='18px'>
                <FormattedMessage
                  id='buttons.requesting_device'
                  defaultMessage='Requesting Device'
                />
              </Text>
            </div>
          </Row>
          <Separator variant='subtle' style={{ margin: '0' }} />
          <Row>
            <div>
              <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
                <FormattedMessage id='buttons.browser' defaultMessage='Browser' />
              </Text>
            </div>
            <div>
              <Text color='black' size='14px' weight={500} lineHeight='21px'>
                {approver_device_description}
              </Text>
            </div>
            <div>
              <Text color='black' size='14px' weight={500} lineHeight='21px'>
                {requester_device_description}
              </Text>
            </div>
          </Row>
          <Separator variant='subtle' style={{ margin: '0' }} />
          <Row>
            <div>
              <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
                <FormattedMessage id='buttons.ip_address' defaultMessage='IP Address' />
              </Text>
            </div>
            <div>
              <Text color='black' size='14px' weight={500} lineHeight='21px'>
                {approver_ip}
              </Text>
            </div>
            <div>
              <Text color='black' size='14px' weight={500} lineHeight='21px'>
                {requester_ip}
              </Text>
            </div>
          </Row>
          <Separator variant='subtle' style={{ margin: '0' }} />
          <Row>
            <div>
              <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
                <FormattedMessage id='buttons.country' defaultMessage='Country' />
              </Text>
            </div>
            <div>
              <Text color='black' size='14px' weight={500} lineHeight='21px'>
                {approver_country}
              </Text>
            </div>
            <div>
              <Text color='black' size='14px' weight={500} lineHeight='21px'>
                {requester_country}
              </Text>
            </div>
          </Row>
          <Separator variant='subtle' style={{ margin: '0' }} />
          <ButtonsRow>
            <Button
              data-e2e='rejectLogin'
              height='48px'
              size='16px'
              nature='primary'
              fullwidth
              onClick={props.onReject}
            >
              <FormattedMessage id='buttons.reject' defaultMessage='Reject' />
            </Button>
            <Button
              data-e2e='approveLogin'
              nature='empty-red'
              height='48px'
              size='16px'
              fullwidth
              onClick={props.onAccept}
            >
              <FormattedMessage id='buttons.verify' defaultMessage='Verify' />
            </Button>
          </ButtonsRow>
        </>
      )}

      {!device_change_reason && (
        <>
          {requestDenied ? (
            <Icon color='error' name='close-circle' size='40px' />
          ) : (
            <Icon color='success' name='checkmark-circle-filled' size='40px' />
          )}
          <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
            {requestDenied ? (
              <FormattedMessage
                id='scenes.authorizelogin.loading.rejected.title'
                defaultMessage='Login Attempt Rejected!'
              />
            ) : (
              <FormattedMessage
                id='scenes.authorizelogin.loading.approved.title'
                defaultMessage='Login Approved!'
              />
            )}
          </Text>
          <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
            {requestDenied ? (
              <FormattedMessage
                id='scenes.authorizelogin.loading.rejected.content'
                defaultMessage='Please contact our support team if you have any questions or concerns.'
              />
            ) : (
              <FormattedMessage
                id='scenes.authorizelogin.loading.approved'
                defaultMessage='Please return to your previous tab to continue login.'
              />
            )}
          </Text>
        </>
      )}
    </Wrapper>
  )
}

export default AuthorizeLogin
