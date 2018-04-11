import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { Icon, ModalHeader, ModalBody } from 'blockchain-info-components'
import FaqGroup from './FaqGroup'

const Fragment = React.Fragment
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

const Faq = (props) => {
  const {onFilter, filterText, filteredContent, handleTrayRightToggle} = props

  return (
    <Fragment>
      <ModalHeader onClose={() => handleTrayRightToggle()}>
        <FormattedMessage id='layouts.wallet.trayright.faq' defaultMessage='Frequently Asked Questions'/>
      </ModalHeader>
      <ModalBody>
        <Wrapper>
          <SearchInputContainer>
            <SearchInputArea value={filterText} onChange={onFilter} placeholder={'Search'}/>
            <SearchIcon name='search' size='18px' weight={200} color='gray-3'/>
          </SearchInputContainer>
          <ContentWrapper>
            {
              filteredContent.length > 0 && filteredContent.map((group, i) => {
                return group.groupQuestions.length > 0 && <FaqGroup groupTitleId={group.groupTitleId} groupTitleMsg={group.groupTitleMsg} groupQuestions={group.groupQuestions} key={i} />
              })
            }
          </ContentWrapper>
        </Wrapper>
      </ModalBody>
    </Fragment>
  )
}

Faq.propTypes = {
  filteredContent: PropTypes.array.isRequired,
  onFilter: PropTypes.func.isRequired,
  filterText: PropTypes.string.isRequired,
  handleTrayRightToggle: PropTypes.func.isRequired
}

export default Faq
