import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { Props } from '.'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const MainContent = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const Requirements = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
`
const ContentTop = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const ContentItem = styled.div`
  padding: 20px;
  border: 1px solid #f0f2f7;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 8px;
`

const ContentFooter = styled.div`
  display: flex;
  flex-direction: column;
`

const BannerContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.blue000};
  border-radius: 8px;
  margin-bottom: 24px;
  padding: 16px;
`

const Title = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
`
const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`
const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.theme.grey000};
  backdrop-filter: blur(54.3656px);
  > span {
    justify-content: center;
  }
`

const AdditionalInfo: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <FlyoutWrapper style={{ borderBottom: 'grey000', paddingBottom: '0px' }}>
        <TopText color='grey800' size='20px' weight={600}>
          <IconsContainer>
            <Title color='textBlack' size='24px' weight={600}>
              <FormattedMessage id='scenes.interest.verifyid' defaultMessage='Upgrade Now' />
            </Title>
            <CloseIconContainer>
              <Icon
                cursor
                data-e2e='tradingLimitsCloseButton'
                name='close'
                size='20px'
                color='grey600'
                role='button'
                onClick={props.onClose}
              />
            </CloseIconContainer>
          </IconsContainer>
        </TopText>
        <Icon name='user' size='32px' color='blue600' />
        <Title color='textBlack' size='24px' weight={600} style={{ marginTop: '18px' }}>
          <FormattedMessage
            id='modals.kycverification.additionalinfo.title'
            defaultMessage='Great, Now We Just Need To Confirm Your Identity.'
          />
        </Title>
        <Text color='grey600' weight={500} size='16px'>
          <FormattedMessage
            id='modals.kycverification.additionalinfo.description'
            defaultMessage='We need to confirm your identity with a government issued ID and selfie. Before proceeding, make sure you have one of the following forms of ID handy and your camera is turned on.'
          />
        </Text>
      </FlyoutWrapper>
      <Requirements>
        <ContentItem>
          <Text color='grey800' weight={600}>
            <FormattedMessage
              id='modals.kycverification.additionalinfo.requirement_1'
              defaultMessage='Government Issued ID'
            />
          </Text>
        </ContentItem>

        <ContentItem>
          <Text color='grey800' weight={600}>
            <FormattedMessage
              id='modals.kycverification.additionalinfo.requirement_2'
              defaultMessage='Valid Driver’s License'
            />
          </Text>
        </ContentItem>

        <ContentItem>
          <Text color='grey800' weight={600}>
            <FormattedMessage
              id='modals.kycverification.additionalinfo.requirement_3'
              defaultMessage='National Identity Card'
            />
          </Text>
        </ContentItem>
      </Requirements>
      <MainContent style={{ paddingTop: '40px' }}>
        <ContentTop>
          <Text color='grey600' weight={500}>
            <FormattedMessage
              id='modals.kycverification.additionalinfo.disclaimer'
              defaultMessage='Blockchain.com’s ID verification process is powered by our partner Veriff. We’ll take you to them on the next screen.'
            />
          </Text>
        </ContentTop>

        <ContentFooter>
          <BannerContainer>
            <Icon size='20px' name='info' color='blue600' />
            <Text
              color='blue600'
              weight={600}
              size='14px'
              style={{ marginLeft: '16px', marginTop: '1px' }}
            >
              <FormattedMessage
                id='modals.kycverification.additionalinfo.webcam_and_microphone'
                defaultMessage='Be sure to enable your Webcam & Microphone.'
              />
            </Text>
          </BannerContainer>
          <Button
            data-e2e='kycAdditionalInfoNextButton'
            height='48px'
            size='16px'
            nature='primary'
            type='submit'
            onClick={props.goToNextStep}
            fullwidth
          >
            <FormattedMessage id='buttons.next' defaultMessage='Next' />
          </Button>
        </ContentFooter>
      </MainContent>
    </Wrapper>
  )
}

export default AdditionalInfo
