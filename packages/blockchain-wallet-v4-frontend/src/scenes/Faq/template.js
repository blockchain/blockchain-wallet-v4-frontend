import React from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import FaqGroup from './FaqGroup'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  box-sizing: border-box;
  overflow: none;
`

const ContentWrapper = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
`

const SearchInputContainer = styled.div`
  width: 100%;
  height: 35px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 0;
  border: 1px solid ${props => props.theme['gray-1']};
`

const SearchInputArea = styled.textarea`
  width: 100%;
  resize: none;
  outline: none;
  border: none;
  box-sizing: border-box;
  padding: 8px 0 0 16px;
  font-size: 14px;
  ::placeholder { 
    font-weight: 100; 
    color: ${props => props.theme['gray-3']}; 
  }
`
const SearchIcon = styled(Icon)`
  padding: 8px 16px 0 0;
`

const Faq = (props) => (
  <Wrapper>
    <SearchInputContainer>
      <SearchInputArea value={''} onChange={() => {}} placeholder={'Search'}/>
      <SearchIcon name='search' size='18px' weight={200} color='gray-3'/>
    </SearchInputContainer>
    <ContentWrapper>
      {
        props.faqContent.map((group, i) => {
          return <FaqGroup groupTitleId={group.groupTitleId} groupTitleMsg={group.groupTitleMsg} groupQuestions= {group.groupQuestions} key={i} />
        })
      }
    </ContentWrapper>
  </Wrapper>
)

Faq.propTypes = {
  faqContent: PropTypes.array.isRequired
}

export default Faq
