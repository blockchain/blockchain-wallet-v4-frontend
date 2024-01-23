import { Form } from 'redux-form'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'

export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  display: block;
  color: ${(props) => props.theme.grey900};
`
const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

export const FullNameContainer = styled.div`
  justify-content: space-between;
  display: flex;
  flex-direction: row;
`

export const CaptionContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
`
export const Caption = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.grey600};
`

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
export const TopHeader = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-direction: column;
`
export const TopHeaderTitle = styled.div`
  display: flex;
  align-items: left;
`
export const TopHeaderDescription = styled(Text)`
  margin: 10px 0 0 0;
  display: flex;
  color: ${(props) => props.theme.grey600};
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
`
export const ErrorTextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`
export const QuestionTitle = styled(Text)`
  display: flex;
  color: ${(props) => props.theme.grey900};
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
`
export const QuestionDescription = styled(Text)`
  margin: 4px 0 12px 0;
  display: flex;
  color: ${(props) => props.theme.grey600};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`

export const ErrorText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 32px;
  background-color: ${(props) => props.theme.red000};
  color: ${(props) => props.theme.red800};
  margin-bottom: 16px;
`

export const CheckBoxContainer = styled.div`
  max-height: 6rem;
  margin: 4px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 24px;
  border: 1px solid ${(props) => props.theme.grey000};
  box-sizing: border-box;
  border-radius: 8px;
`

export const CheckBoxText = styled(Text)`
  font-weight: 400;
  font-size: 16px;
  max-width: 312px;
  padding: 0.25rem 0;
  color: ${(props) => props.theme.grey900};
`
export const DropdownStyled = styled.div`
  z-index: 9;
  background-color: ${(props) => props.theme.white};
`
export const CenterField = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const LabelItem = styled.label`
  cursor: pointer;
`

export const FooterWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 0.5rem;
  text-align: center;
`

export const StyledAnchor = styled(Link)`
  box-sizing: border-box;
  height: 3rem;
  text-align: center;
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 0.5rem;
`

export const ResultsWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px;
`

export const FinalPageContent = styled.div`
  margin-top: 4rem;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;

  > span {
    margin-bottom: 1.5rem;
  }
`
