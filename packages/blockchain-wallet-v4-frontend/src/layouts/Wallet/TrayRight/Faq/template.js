import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'

import { Icon } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import FaqGroup from './FaqGroup'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: scroll;
`
const Search = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;

  & > :last-child {
    position: absolute;
    top: 10px;
    right: 10px;
  }
`
const Content = styled.div`
  height: 100%;
  overflow-y: scroll;
`

const Faq = (props) => (
  <Wrapper>
    <Search>
      <Field name='search' component={TextBox} />
      <Icon name='search' size='20px' weight={200} color='gray-3' />
    </Search>
    <Content>
      {props.filteredContent.length > 0 && props.filteredContent.map((group, i) =>
        <FaqGroup groupTitleId={group.groupTitleId}
          groupTitleMsg={group.groupTitleMsg}
          groupQuestions={group.groupQuestions}
          key={i} />
      )}
    </Content>
  </Wrapper>
)

Faq.propTypes = {
  filteredContent: PropTypes.array.isRequired
}

export default reduxForm({ form: 'faq', initialValues: { search: '' } })(Faq)
