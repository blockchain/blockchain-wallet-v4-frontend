import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'

import { Icon, ModalHeader, ModalBody } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
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
  margin: 20px 0px;
  border: 1px solid ${props => props.theme['gray-1']};
`

const SearchIcon = styled(Icon)`
  position: absolute;
  top: 30px;
  right: 30px;
`

const Faq = (props) => {
  const {filteredContent, handleTrayRightToggle} = props

  return (
    <Fragment>
      <ModalHeader onClose={() => handleTrayRightToggle()}>
        <FormattedMessage id='layouts.wallet.trayright.faq' defaultMessage='Frequently Asked Questions' />
      </ModalHeader>
      <ModalBody>
        <Wrapper>
          <SearchInputContainer>
            <Field name='search' component={TextBox} />
            <SearchIcon name='search' size='20px' weight={200} color='gray-3' />
          </SearchInputContainer>
          <ContentWrapper>
            {
              filteredContent.length > 0 && filteredContent.map((group, i) => {
                return group.groupQuestions.length > 0 &&
                  <FaqGroup groupTitleId={group.groupTitleId}
                    groupTitleMsg={group.groupTitleMsg}
                    groupQuestions={group.groupQuestions}
                    key={i} />
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
  handleTrayRightToggle: PropTypes.func.isRequired
}

export default reduxForm({ form: 'faq' })(Faq)
