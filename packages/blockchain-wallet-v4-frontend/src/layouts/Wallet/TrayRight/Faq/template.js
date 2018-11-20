import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
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
  margin-bottom: 20px;

  & > :last-child {
    position: absolute;
    top: 50%;
    margin-top: -10px;
    right: 10px;
  }
`
const Content = styled.div`
  width: 100%;
  height: calc(100% - 130px);
`
const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 20px auto;
`

const Faq = props => (
  <Wrapper>
    <ContentHeader>
      <Text size='14px'>
        <FormattedMessage
          id='faq.content.help'
          defaultMessage='Need more help?'
        />
      </Text>
      <Link href='https://support.blockchain.com/' target='_blank'>
        <Button nature='primary'>
          <FormattedMessage
            id='faq.content.supportcenter'
            defaultMessage='Support Center'
          />
        </Button>
      </Link>
    </ContentHeader>
    <Search>
      <Field name='search' component={TextBox} />
      <Icon name='search' size='20px' weight={200} color='gray-3' />
    </Search>
    <Content>
      {props.filteredContent.length > 0 &&
        props.filteredContent.map((group, i) => (
          <FaqGroup
            groupTitleId={group.groupTitleId}
            groupTitleMsg={group.groupTitleMsg}
            groupQuestions={group.groupQuestions}
            key={i}
          />
        ))}
    </Content>
  </Wrapper>
)

Faq.propTypes = {
  filteredContent: PropTypes.array.isRequired
}

export default reduxForm({ form: 'faq', initialValues: { search: '' } })(Faq)
