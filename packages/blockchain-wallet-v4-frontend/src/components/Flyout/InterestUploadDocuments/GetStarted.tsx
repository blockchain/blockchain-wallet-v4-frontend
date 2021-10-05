import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'

import Container from '../Container'
import Content from '../Content'
import Footer from '../Footer'
import Header from '../Header'

const TextContentWrapper = styled.div`
  padding: 0 40px;
  display: flex;
  flex-direction: column;
`

const Items = styled.div`
  margin-top: 44px;
`

const Item = styled.div`
  padding: 20px 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TierDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
`

const TierTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
`

const ItemSubtitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
`

const GetStarted = ({ nextStep, previousStep }: Props) => {
  return (
    <Container>
      <Header data-e2e='InterestUploadDocumentsCloseButton' mode='back' onClick={previousStep}>
        <FormattedMessage
          id='modals.interest.withdrawal.upload_documents.get_started.title'
          defaultMessage='Upload & Verify'
        />
      </Header>
      <Content mode='top'>
        <TextContentWrapper>
          <Text size='14px' weight={500} color='grey900' lineHeight='20px'>
            <>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.get_started.description'
                defaultMessage='Please upload a clear photo of each file or document listed below.'
              />{' '}
              <Link
                size='16px'
                weight={500}
                target='_blank'
                href='https://support.blockchain.com/hc/en-us/'
              >
                <FormattedMessage id='buttons.learn_more_arrow' defaultMessage='Learn more ->' />
              </Link>
            </>
          </Text>
        </TextContentWrapper>

        <Items>
          <Item>
            <div>
              <Image name='proof-of-address' size='32px' />
            </div>
            <TierDescription>
              <TierTitle>
                <FormattedMessage
                  id='modals.interest.withdrawal.upload_documents.get_started.proof_of_current_address'
                  defaultMessage='Proof of Current Address'
                />
              </TierTitle>
              <ItemSubtitle color='grey900' size='14px' weight={500}>
                <FormattedMessage
                  id='modals.interest.withdrawal.upload_documents.get_started.bank_acccount_statement'
                  defaultMessage='Bank Account Statement or Utility Bill'
                />
              </ItemSubtitle>

              <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
                <FormattedMessage
                  id='modals.interest.withdrawal.upload_documents.get_started.bank_acccount_statement.description'
                  defaultMessage='Must be dated within the last 90 days or a council tax bill for the current tax year.'
                />
              </Text>
            </TierDescription>
          </Item>
          <Item>
            <div>
              <Image name='source-of-wealth' size='32px' />
            </div>
            <TierDescription>
              <TierTitle>
                <FormattedMessage
                  id='modals.interest.withdrawal.upload_documents.get_started.source_of_wealth.source_of_wealth'
                  defaultMessage='Source of Wealth'
                />
              </TierTitle>
              <ItemSubtitle color='grey900' size='14px' weight={500}>
                <FormattedMessage
                  id='modals.interest.withdrawal.upload_documents.get_started.source_of_wealth.bank_account'
                  defaultMessage='Bank Account Statement or Pay Stub'
                />
              </ItemSubtitle>

              <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
                <FormattedMessage
                  id='modals.interest.withdrawal.upload_documents.get_started.source_of_wealth.information'
                  defaultMessage='Information and/or supporting documentation to establish source of wealth.'
                />
              </Text>
            </TierDescription>
          </Item>
        </Items>
      </Content>
      <Footer>
        <Button
          nature='primary'
          data-e2e='additionalInfoUploadDocument'
          type='button'
          fullwidth
          height='48px'
          style={{ marginTop: '16px' }}
          onClick={nextStep}
        >
          <FormattedMessage
            id='modals.interest.withdrawal.upload_documents.get_started.button'
            defaultMessage='Get Started'
          />
        </Button>
      </Footer>
    </Container>
  )
}

export type Props = {
  nextStep: () => void
  previousStep: () => void
}

export default GetStarted
