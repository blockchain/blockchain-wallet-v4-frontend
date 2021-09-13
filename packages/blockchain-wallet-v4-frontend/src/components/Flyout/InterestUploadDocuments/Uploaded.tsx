import React, { useCallback } from 'react'
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

const InfoContent = styled.div`
  text-align: center;
`

const Uploaded = ({ close }: Props) => {
  const closeModal = useCallback(() => {
    close()
  }, [])
  return (
    <Container>
      <Header data-e2e='InterestUploadDocumentsCloseButton' mode='close' onClick={closeModal} />
      <Content mode='middle'>
        <InfoContent>
          <Image name='cloud-check' size='102px' />
          <TextContentWrapper style={{ marginTop: '27px' }}>
            <Text size='20px' weight={600} color='grey900' lineHeight='30px'>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.uploaded.documents_uploaded'
                defaultMessage='Documents Uploaded!'
              />
            </Text>
          </TextContentWrapper>
          <TextContentWrapper>
            <Text size='14px' weight={500} color='grey900' lineHeight='20px'>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.uploaded.description_1'
                defaultMessage='We’ve successfully received your files. A Blockchain.com team memeber will review and get back to you.'
              />
            </Text>
          </TextContentWrapper>
          <TextContentWrapper style={{ marginTop: '20px' }}>
            <Text size='14px' weight={500} color='grey900' lineHeight='20px'>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.uploaded.description_2'
                defaultMessage='If you have any questions, please contact us.'
              />
            </Text>
            <Text size='14px' weight={500} color='grey900' lineHeight='20px'>
              <Link size='14px' weight={500}>
                <FormattedMessage
                  id='modals.interest.withdrawal.upload_documents.uploaded.email'
                  defaultMessage='support@blockchain.com'
                />
              </Link>
            </Text>
          </TextContentWrapper>
        </InfoContent>
      </Content>
      <Footer>
        <Button
          nature='primary'
          data-e2e='additionalInfoUploadDocument'
          type='button'
          fullwidth
          height='48px'
          style={{ marginTop: '16px' }}
          onClick={closeModal}
        >
          <FormattedMessage id='button.ok' defaultMessage='OK' />
        </Button>
      </Footer>
    </Container>
  )
}

export type Props = {
  close: () => void
}

export default Uploaded
