import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

import {
  Code,
  CodeSection,
  CopyContainer,
  CopyReferralCode,
  InstructionContainer,
  InstructionSection,
  ReferralBgImage,
  ReferralMobileImage,
  ShareButton,
  ShareLink,
  StepContainer,
  StepIcon,
  StepText,
  Subtitle,
  Title,
  TitleSection,
  Wrapper
} from './Referral.model'

const Referral = ({
  code,
  copiedToClipboard,
  criteria,
  handleCopyToClipboard,
  rewardSubtitle,
  rewardTitle
}: Props) => (
  <Wrapper>
    <ReferralBgImage name='bg-referral' />
    <ReferralMobileImage name='referral-icon' />
    <TitleSection>
      <Title color='grey900'>{rewardTitle}</Title>
      <Subtitle>{rewardSubtitle}</Subtitle>
    </TitleSection>
    <CodeSection>
      <CopyReferralCode>
        <FormattedMessage
          defaultMessage='Copy your referral code'
          id='scenes.referral.copyyourcode'
        />
      </CopyReferralCode>
      <CopyContainer>
        <Code line-height='125%' weight={500}>
          {code}
        </Code>
        {copiedToClipboard ? (
          <Text color='blue600' lineHeight='17px' size='14px' weight={400}>
            <FormattedMessage defaultMessage='Copied' id='copy.copied' />
          </Text>
        ) : (
          <Text
            color='blue600'
            lineHeight='17px'
            onClick={handleCopyToClipboard}
            size='14px'
            weight={400}
            cursor='pointer'
          >
            <FormattedMessage defaultMessage='Copy' id='copy.copy' />
          </Text>
        )}
      </CopyContainer>
      <ShareLink href='mailto:?body=tisbody&subject=thisbethesubject'>
        <ShareButton data-e2e='referral-share-button' nature='primary'>
          <FormattedMessage defaultMessage='Share' id='copy.share' />
        </ShareButton>
      </ShareLink>
    </CodeSection>
    <InstructionSection>
      <Text>
        <FormattedMessage
          defaultMessage='What my invited friends need to do?'
          id='scenes.referral.invited.friends.do'
        />
      </Text>
      <InstructionContainer>
        {criteria.map((step, index) => (
          <StepContainer key={step}>
            <StepIcon>{index + 1}</StepIcon>
            <StepText color='grey900' lineHeight='150%' weight={500}>
              {step}
            </StepText>
          </StepContainer>
        ))}
      </InstructionContainer>
    </InstructionSection>
  </Wrapper>
)

type Props = {
  code: string
  copiedToClipboard: boolean
  criteria: Array<string>
  handleCopyToClipboard: () => void
  rewardSubtitle: string
  rewardTitle: string
}

export default Referral
