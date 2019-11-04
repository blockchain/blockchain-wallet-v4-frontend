import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import React, { useEffect } from 'react'
import styled from 'styled-components'

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
const ApproveWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 33px;
  > div:nth-child(2) {
    margin: 0px 5px;
  }
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
    requester_device_description,
    approver_country,
    requester_country,
    approver_ip,
    requester_ip
  } = props.value
  const requestDenied = props.value['request-denied']
  /* eslint-enable */

  useEffect(() => {
    if (!props.value.device_change_reason) props.handleSuccessContainer()
  })

  return (
    <Wrapper>
      {props.value.device_change_reason ? (
        <Fragment>
          <InfoWrapper>
            <Text size='20px' weight={500} color='grey800'>
              <FormattedMessage
                id='scenes.authorizelogin.attemptfrombrowser-1'
                defaultMessage='New Login Attempt'
              />
            </Text>
            <Text
              size='16px'
              weight={400}
              color='grey800'
              style={{ 'margin-top': '15px' }}
            >
              <FormattedMessage
                id='scenes.authorizelogin.attemptfrombrowsermsg-1'
                defaultMessage='Looks like someone is attempting to login to your wallet.'
              />
            </Text>
            <Text
              size='14px'
              weight={400}
              color='grey700'
              style={{ 'margin-top': '24px' }}
            >
              <FormattedMessage
                id='scenes.authorizelogin.attemptfrombrowser.ipaddress'
                defaultMessage='IP Address'
              />
            </Text>
            <Text size='16px' color='grey800' weight={600}>
              {requester_ip}
            </Text>
            <Text size='16px' color='grey800' weight={600}>
              {requester_country}
            </Text>
            <Text />
            <Text
              size='14px'
              weight={400}
              color='grey700'
              style={{ 'margin-top': '24px' }}
            >
              <FormattedMessage
                id='scenes.authorizelogin.attemptfrombrowser.browser'
                defaultMessage='Browser'
              />
            </Text>
            <Text size='16px' color='grey800' weight={600}>
              {requester_device_description}
            </Text>
            <ApproveWrapper>
              <Button
                nature='warning'
                width='188px'
                height='56px'
                size='17px'
                onClick={props.onReject}
              >
                <FormattedMessage
                  id='scenes.authorizelogin.deny'
                  defaultMessage='Deny'
                />
              </Button>
              <Button
                nature='authorize-login-approve'
                width='188px'
                height='56px'
                size='17px'
                onClick={props.onAccept}
              >
                <FormattedMessage
                  id='scenes.authorizelogin.Approve'
                  defaultMessage='Approve'
                />
              </Button>
            </ApproveWrapper>
          </InfoWrapper>
        </Fragment>
      ) : (
        <Fragment>
          {requestDenied ? (
            <Icon name='close-filled' color='error' size='40px' />
          ) : (
            <Image name='checkmark-green' width='56px' height='56px' />
          )}
          <Title size='20px' weight={600} color='brand-primary'>
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
