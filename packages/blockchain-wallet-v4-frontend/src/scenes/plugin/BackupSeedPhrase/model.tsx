import {
  IconArrowLeft,
  IconChevronRight,
  IconQuestionCircle,
  IconVisibilityOff
} from '@blockchain-com/icons'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import Form from 'components/Form/Form'

export const Bottom = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  margin: auto 0 0;
`
export const WordContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
  color: red;
  div > input {
    background: unset;
    border: 1px solid ${(props) => props.theme.grey800};
    color: ${(props) => props.theme.grey600};
  }
  > div + div {
    padding-bottom: unset;
  }
`
export const LinkWrapper = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 56px;
  padding: 16px 24px;
  margin-bottom: 32px;
  border: 1px solid #4d515b;
  border-radius: 8px;
  cursor: pointer;
  box-sizing: border-box;
  color: white;
`
export const CustomForm = styled(Form)`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`
export const BackIconWrapper = styled(IconArrowLeft)`
  cursor: pointer;
  color: ${(props) => props.theme.grey600};
`
export const InfoIconWrapper = styled(IconQuestionCircle)`
  cursor: pointer;
  color: ${(props) => props.theme.grey600};
`
export const ChevronRightIconWrapper = styled(IconChevronRight)`
  color: ${(props) => props.theme.grey400};
`
export const VisibilityIconWrapper = styled(IconVisibilityOff)`
  color: ${(props) => props.theme.grey600};
`
export const PhraseContainer = styled(Flex)`
  position: relative;
  flex-wrap: wrap;
  width: 100%;
  height: 152px;
  border: 0.3px solid ${(props) => props.theme.grey600};
  border-radius: 6px;
  margin: 76px 0 13px;
  padding: 10px 12px;
  box-sizing: border-box;
`
export const HiddenPhraseBlock = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
`
export const ButtonWrapper = styled(Text)`
  color: ${(props) => props.theme['marketing-primary']};
  size: '12px';
  font-weight: 500;
  line-height: '150%';
  font-size: 12px;
`
export const TitleWrapper = styled(Text)`
  margin: 29px auto 12px 0;
`
export const TextWrapper = styled(Flex)`
  margin: 0 auto;
`
export const TextWithMargins = styled(Text)`
  margin: 29px 0 12px;
`
export const TextWithMargin = styled(Text)`
  margin-bottom: 62px;
`
export const FlexWithMargin = styled(Flex)`
  margin: 105px auto 27px;
`
