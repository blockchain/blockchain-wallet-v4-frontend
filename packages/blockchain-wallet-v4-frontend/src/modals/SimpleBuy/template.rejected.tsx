import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import {
  DisplayTitle,
  NumberContainer,
  NumberDescription,
  NumberWrapper,
  RowNumber,
  Subcontent,
  SubTitle,
  Title
} from './template.rejected.styles'

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
  position: relative;
  height: 100%;
`

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const MainText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const DisclaimerTitle = styled(Title)`
  color: ${props => props.theme.grey600};
  margin-bottom: 34px;
  font-size: 12px;
  text-align: center;
`

const Rejected: React.FC<{ handleClose: () => void }> = props => {
  return (
    <Top>
      <MainText color='grey800' size='20px' weight={600}>
        <Icon
          cursor
          data-e2e='sbCloseModalIcon'
          name='user'
          size='22px'
          color='blue600'
        />
        <Icon
          cursor
          data-e2e='sbCloseModalIcon'
          name='close'
          size='20px'
          color='grey600'
          role='button'
          onClick={props.handleClose}
        />
      </MainText>
      <Container>
        <Title color='textBlack' size='24px' weight={600}>
          <FormattedMessage
            id='modals.simplebuy.rejected.title'
            defaultMessage='Unable to Verify Your ID'
          />
        </Title>
        <Title color='grey800' size='16px' weight={500}>
          <FormattedMessage
            id='modals.simplebuy.rejected.subtitle'
            defaultMessage='We were unable to verify your identity. This can happen for a few reasons.'
          />
        </Title>
        <Subcontent color='grey600' weight={500}>
          <RowNumber>
            <NumberWrapper>
              <NumberContainer>1</NumberContainer>
            </NumberWrapper>
            <NumberDescription>
              <DisplayTitle>
                <FormattedMessage
                  id='modals.simplebuy.rejected.invalid_id'
                  defaultMessage='Invalid ID'
                />
              </DisplayTitle>
              <SubTitle>
                <FormattedMessage
                  id='modals.simplebuy.rejected.invalid_id_description'
                  defaultMessage='The image or document uploaded did not match the requirements.'
                />
              </SubTitle>
            </NumberDescription>
          </RowNumber>
          <RowNumber>
            <NumberWrapper>
              <NumberContainer>2</NumberContainer>
            </NumberWrapper>
            <NumberDescription>
              <DisplayTitle>
                <FormattedMessage
                  id='modals.simplebuy.rejected.information_mismatch'
                  defaultMessage='Information Mismatch'
                />
              </DisplayTitle>
              <SubTitle>
                <FormattedMessage
                  id='modals.simplebuy.rejected.information_mismatch_description'
                  defaultMessage='All information must appear exactly as it does on your legal documents. Note: Please do not use a nickname.'
                />
              </SubTitle>
            </NumberDescription>
          </RowNumber>
          <RowNumber>
            <NumberWrapper>
              <NumberContainer>3</NumberContainer>
            </NumberWrapper>
            <NumberDescription>
              <DisplayTitle>
                <FormattedMessage
                  id='modals.simplebuy.rejected.blocked_by_laws'
                  defaultMessage='Blocked by Local Laws'
                />
              </DisplayTitle>
              <SubTitle>
                <FormattedMessage
                  id='modals.simplebuy.rejected.blocked_by_laws_description'
                  defaultMessage='At Blockchain.com, we strive to adhere to any and all local laws. Based on your location, we cannot allow the buying or selling digital currencies at this time.'
                />
              </SubTitle>
            </NumberDescription>
          </RowNumber>
        </Subcontent>
        <DisclaimerTitle>
          <FormattedMessage
            id='modals.simplebuy.rejected.disclaimer'
            defaultMessage='If you think this was a mistake or would like a manual review of your account, please contact support.'
          />
        </DisclaimerTitle>

        <Link
          style={{ width: '100%' }}
          target='_blank'
          href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000186571'
        >
          <Button fullwidth nature='empty-blue' data-e2e='contactSupport'>
            <FormattedMessage
              id='modals.simplebuy.rejected.contact_support'
              defaultMessage='Contact Support'
            />
          </Button>
        </Link>
      </Container>
    </Top>
  )
}

export default Rejected
