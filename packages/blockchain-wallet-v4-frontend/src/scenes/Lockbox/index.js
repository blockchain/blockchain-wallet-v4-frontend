import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { Box } from 'components/Box'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`
const BoxStyled = styled(Box)`
  display: flex;
  width: 19.5rem;
`
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`
const Title = styled(Text)`
  margin-left: 1rem;
`
const Paragraph = styled(Text)`
  line-height: 1.5;
  margin-bottom: 0.75rem;
`
const LearnMoreButton = styled(Button)`
  margin-top: 1.25rem;
`

const Lockbox = () => {
  return (
    <Wrapper>
      <BoxStyled>
        <ContentWrapper>
          <TitleWrapper>
            <Image name='alert' width='32px' />
            <Title size='20px' color='grey800' weight={600}>
              <FormattedMessage
                id='scenes.lockbox.title'
                defaultMessage='Notice for Discontinuation of Lockbox'
              />
            </Title>
          </TitleWrapper>
          <Paragraph size='14px' color='grey600' weight={500}>
            <FormattedMessage
              id='scenes.lockbox.discontinued1'
              defaultMessage='We regret to inform you that we have ended support for Lockbox on the Blockchain.com wallet.  Your device and funds contained on it are safe and are able to be recovered via your 24 word recovery phrase for the device.'
            />
          </Paragraph>
          <Paragraph size='14px' color='grey600' weight={500}>
            <FormattedMessage
              id='scenes.lockbox.discontinued2'
              defaultMessage='View the article below for more detailed information on how to recover your funds.'
            />
          </Paragraph>
          <Link
            href='https://support.blockchain.com/hc/en-us/articles/360018285872-How-to-recover-your-Lockbox-funds'
            target='_blank'
          >
            <LearnMoreButton
              data-e2e='lockboxDiscontinuedInstructions'
              fullwidth
              nature='dark-grey'
            >
              <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
            </LearnMoreButton>
          </Link>
        </ContentWrapper>
      </BoxStyled>
    </Wrapper>
  )
}

export default Lockbox
