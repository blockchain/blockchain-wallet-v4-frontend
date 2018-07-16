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
  width: 100%;
  height: 100%;
  padding: 0 30px 30px 30px;
  box-sizing: border-box;
`
const Search = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;

  & > :last-child {
    position: absolute;
    top: 50%;
    margin-top: -10px;
    right: 10px;
  }
`
const Content = styled.div`
  width: 100%;
  height: calc(100% - 80px);
  overflow-x: auto;
  overflow-y: auto;
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
