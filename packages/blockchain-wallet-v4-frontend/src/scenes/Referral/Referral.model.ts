import styled from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { SceneWrapper } from 'components/Layout'
import { media } from 'services/styles'

export const Wrapper = styled(SceneWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 120px;
  padding-top: 34px;

  & > section {
    z-index: 1;
  }

  ${media.mobile`
    gap: 0;
  `}
`
export const ReferralBgImage = styled(Image)`
  position: absolute;
  top: -32px;
  right: -28px;

  ${media.mobile`
    display: none;
  `}
`

export const ReferralMobileImage = styled(Image)`
  display: none;

  ${media.mobile`
  display: block;
  margin-bottom: 24px;
`}
`
export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  ${media.tablet`
  gap: 12px;
  margin-bottom: 46px;
`}
`
export const Title = styled(Text)`
  font-size: 40px;
  font-weight: 600;

  ${media.mobile`
  font-size: 24px;
`}
`
export const Subtitle = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  text-align: center;

  ${media.mobile`
  font-size: 14px;
`}
`
export const CodeSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 442px;
  width: 100%;

  ${media.mobile`
  align-items: center;
  margin-bottom: 40px;
  gap: 0;

  & div:first-child {
    margin-bottom: 8px;
  }
`}
`
export const CopyReferralCode = styled(Text)`
  ${media.mobile`
  font-size: 14px;
`}
`
export const CopyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 24px 48px 80px;
  background-color: ${({ theme }) => theme.ultraLight};

  ${media.mobile`
  flex-direction: column;
  padding: 25px 65px;
  gap: 10px;
  margin-bottom: 16px;
`}
`
export const Code = styled(Text)`
  font-size: 24px;
  letter-spacing: 16px;
`
export const ShareLink = styled(Link)`
  width: fit-content;
`
export const ShareButton = styled(Button)`
  padding: 12px 20px;
  min-width: auto;
  height: 48px;
`
export const InstructionSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 668px;
  width: 100%;
  gap: 30px;

  ${media.mobile`
  gap: 24px;
`}
`
export const InstructionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 64px;
  margin-bottom: 86px;

  ${media.tablet`
  flex-direction: column;
`}

  ${media.mobile`
  gap: 22px;
  margin-bottom: 30px;
`}
`
export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.ultraLight};
  border-radius: 16px;
  padding: 30px 38px;
  width: 104px;
  min-height: 90px;
  gap: 16px;

  ${media.mobile`
  flex-direction: row;
  background-color: transparent;
  width: auto;
  min-height: auto;
`}
`
export const StepIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.blue100};
  border-radius: 50%;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.blue600};
`
export const StepText = styled(Text)`
  text-align: center;

  ${media.mobile`
  font-size: 14px;
`}
`
