import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Banner, Button, Icon, Image, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Fragment = React.Fragment

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`
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

const ApproveRejectButtons = styled(Button)`
  margin: 8px;
  ${media.mobile` 
  margin: 0;
`}
`

const Title = styled(Text)`
  margin: 40px 0 14px 0;
  line-height: 22px;
  width: 252px;
`

const Content = styled(Text)`
  line-height: 22px;
  width: 252px;
`

const Success = props => {
  /* eslint-disable */
  const {
    approver_device_description,
    requester_device_description
  } = props.value
  const { approver_country, requester_country } = props.value
  const { approver_ip, requester_ip } = props.value
  const requestDenied = props.value['request-denied']
  /* eslint-enable */

  useEffect(() => {
    if (!props.value.device_change_reason) props.handleSuccessContainer()
  })

  return (
    <Wrapper>
      {props.value.device_change_reason ? (
        <Fragment>
          <Image name='blockchain-icon' width='50px' height='50px' />
          <InfoWrapper>
            <Text
              size='24px'
              weight={500}
              color='grey700'
              style={{ marginTop: '24px' }}
            >
              <FormattedMessage
                id='scenes.authorizelogin.attemptfrombrowser'
                defaultMessage='Login attempt from another browser'
              />
            </Text>
            <Text
              size='13px'
              weight={400}
              color='grey700'
              style={{ marginTop: '10px' }}
            >
              <FormattedMessage
                id='scenes.authorizelogin.attemptfrombrowsermsg'
                defaultMessage='Someone, hopefully you, is attempting to login to your wallet from a different browser.'
              />
            </Text>
            <DeviceInfoWrapper>
              <DeviceInfoHeader>
                <Text size='16px' weight={500} color='success'>
                  <FormattedMessage
                    id='scenes.authorizelogin.yourdevice'
                    defaultMessage='Your Device'
                  />
                </Text>
                &nbsp;
                <Text size='16px' weight={500} color='grey700'>
                  <FormattedMessage
                    id='scenes.authorizelogin.vs'
                    defaultMessage='vs.'
                  />
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
                    {approver_device_description ===
                    requester_device_description ? (
                      <Icon
                        name='checkmark-in-circle-filled'
                        color='success'
                        size='15px'
                      />
                    ) : (
                      <Icon name='close' color='error' size='22px' />
                    )}
                    &nbsp;
                    <Text size='14px' style={{ paddingLeft: '6px' }}>
                      <FormattedMessage
                        id='scenes.authorizelogin.browser'
                        defaultMessage='Browser: '
                      />
                    </Text>
                  </DeviceInfoTitleRow>
                  <Banner type='success' inline>
                    {approver_device_description}
                  </Banner>
                  {approver_device_description !==
                    requester_device_description && (
                    <Banner type='warning' inline>
                      {requester_device_description}
                    </Banner>
                  )}
                  {/* eslint-enable */}
                </DeviceInfoRow>
                <DeviceInfoRow>
                  <DeviceInfoTitleRow>
                    {/* eslint-disable */}
                    {approver_ip === requester_ip ? (
                      <Icon
                        name='checkmark-in-circle-filled'
                        color='success'
                        size='13px'
                      />
                    ) : (
                      <Icon name='close' color='error' size='22px' />
                    )}
                    &nbsp;
                    <Text size='14px'>
                      <FormattedMessage
                        id='scenes.authorizelogin.ipaddress'
                        defaultMessage='IP Address: '
                      />
                    </Text>
                  </DeviceInfoTitleRow>
                  <Banner type='success' inline>
                    {approver_ip}
                  </Banner>
                  {approver_ip !== requester_ip && (
                    <Banner type='warning' inline>
                      {requester_ip}
                    </Banner>
                  )}
                  {/* eslint-enable */}
                </DeviceInfoRow>
                <DeviceInfoRow>
                  <DeviceInfoTitleRow>
                    {/* eslint-disable */}
                    {approver_country === requester_country ? (
                      <Icon
                        name='checkmark-in-circle-filled'
                        color='success'
                        size='13px'
                      />
                    ) : (
                      <Icon name='close' color='error' size='22px' />
                    )}
                    &nbsp;
                    <Text size='14px'>
                      <FormattedMessage
                        id='scenes.authorizelogin.country'
                        defaultMessage='Country of Origin: '
                      />
                    </Text>
                  </DeviceInfoTitleRow>
                  <Banner type='success' inline>
                    {approver_country}
                  </Banner>
                  {approver_country !== requester_country && (
                    <Banner type='warning' inline>
                      {requester_country}
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
                onClick={props.onAccept}
              >
                <FormattedMessage
                  id='scenes.authorizelogin.accept'
                  defaultMessage='Accept'
                />
              </ApproveRejectButtons>
              <OrText size='12px' weight={400}>
                <FormattedMessage
                  id='scenes.authorizelogin.or'
                  defaultMessage='Or'
                />
              </OrText>
              <ApproveRejectButtons
                data-e2e='rejectLogin'
                nature='primary'
                onClick={props.onReject}
              >
                <FormattedMessage
                  id='scenes.authorizelogin.reject'
                  defaultMessage='Reject'
                />
              </ApproveRejectButtons>
            </ApproveWrapper>
          </InfoWrapper>
        </Fragment>
      ) : (
        <Fragment>
          {requestDenied ? (
            <Icon name='close' color='error' size='52px' />
          ) : (
            <Image name='checkmark-green' width='56px' height='56px' />
          )}
          <Title size='20px' weight={600} color='blue900'>
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
          </Title>
          <Content size='16px' weight={500} color='grey700'>
            {requestDenied ? (
              <FormattedMessage
                id='scenes.authorizelogin.loading.rejected.content'
                defaultMessage='Please contact our support team if you have any questions or concerns.'
              />
            ) : (
              <FormattedMessage
                id='scenes.authorizelogin.loading.approved.content'
                defaultMessage='Please return to your previous tab to view your wallet.'
              />
            )}
          </Content>
        </Fragment>
      )}
    </Wrapper>
  )
}

export default Success
