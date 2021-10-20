import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import { Props } from '..'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const OrText = styled(Text)`
  visibility: visible;
  ${media.mobile` 
  visibility: hidden;
`}
`

const Success = (props: Props) => {
  return (
    <>
      <FormBody>
        <Image name='blockchain-icon' width='40px' height='40px' />
        <Text size='20px' weight={600} color='black' style={{ marginTop: '24px' }}>
          <FormattedMessage
            id='scenes.authorizelogin.attemptfrombrowser'
            defaultMessage='Login attempt from another browser'
          />
        </Text>
      </FormBody>
      <ApproveWrapper>
        <ApproveRejectButtons
          data-e2e='approveLogin'
          nature='warning'
          onClick={() => props.authActions.authorizeVerifyDevice()}
        >
          <FormattedMessage id='scenes.authorizelogin.accept' defaultMessage='Accept' />
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
