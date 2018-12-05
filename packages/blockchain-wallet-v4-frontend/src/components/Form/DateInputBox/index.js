import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { replace } from 'ramda'
import { FormattedMessage, injectIntl } from 'react-intl'

import media from 'services/ResponsiveService'

import { Text } from 'blockchain-info-components'
import SelectBox from '../SelectBox'
import NumberBox from '../NumberBox'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: space-between;
  width: 100%;
`
const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
    margin-bottom: 0;
  `};
`
const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-itmes: flex-start;
  justify-content: flex-start;
`
const MonthWrapper = styled(LabelWrapper)`
  width: 50%;
  margin-right: 15px;
  ${media.mobile`
    margin: 0;
    width: 100%;
  `};
`
const InputsWrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
  ${media.mobile`
    width: 100%;
    margin-top: 24px;
  `};
`
const InputWrapper = styled(LabelWrapper)`
  width: 50%;
  & :first-child {
    margin-right: 15px;
  }
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: ${props => (props.errorBottom ? 40 : -20)}px;
  right: 0;
  height: 15px;
`

const monthElements = [
  {
    group: '',
    items: moment.months().map((month, index) => {
      const value = `${index + 1 < 10 ? '0' : ''}${index + 1}`
      return {
        text: `${value} - ${month}`,
        value
      }
    })
  }
]

const removeExtraDigits = maxDigits =>
  replace(new RegExp(`(.{${maxDigits}}).*`), ($0, $1) => $1)
const formatDate = removeExtraDigits(2)
const formatYear = removeExtraDigits(4)

class DateInputBox extends React.PureComponent {
  state = {
    isActive: false
  }

  onBlur = () => {
    this.setState({ isActive: false })
    requestAnimationFrame(() => {
      // If one of the other DateInputBox's field has been focused
      // isActive is true
      if (!this.state.isActive) this.props.input.onBlur(this.props.input.value)
    })
  }

  onFocus = e => {
    if (!this.state.isActive) this.props.input.onFocus(e)
    this.setState({ isActive: true })
  }

  onMonthChange = month => {
    this.props.input.onChange({
      ...this.props.input.value,
      month
    })
  }

  onYearChange = e =>
    this.props.input.onChange({
      ...this.props.input.value,
      year: formatYear(e.target.value)
    })

  onDateChange = e =>
    this.props.input.onChange({
      ...this.props.input.value,
      date: formatDate(e.target.value)
    })

  render () {
    const { input, meta, errorBottom, intl, className } = this.props
    const { error, ...otherMeta } = meta

    return (
      <Container className={className}>
        <RowWrapper>
          <MonthWrapper>
            <SelectBox
              label={
                <FormattedMessage
                  id='components.DateInputBox.placeholder.month'
                  defaultMessage='Month'
                />
              }
              menuPlacement='auto'
              elements={monthElements}
              input={{
                name: 'month',
                value: input.value.month,
                onBlur: this.onBlur.bind(this, 'month'),
                onChange: this.onMonthChange,
                onFocus: this.onFocus
              }}
              meta={otherMeta}
            />
          </MonthWrapper>
          <InputsWrapper className='inputs-wrapper'>
            <InputWrapper>
              <NumberBox
                placeholder={intl.formatMessage({
                  id: 'components.DateInputBox.placeholder.day',
                  defaultMessage: 'Day'
                })}
                input={{
                  name: 'date',
                  value: input.value.date,
                  onBlur: this.onBlur.bind(this, 'date'),
                  onChange: this.onDateChange,
                  onFocus: this.onFocus
                }}
                meta={otherMeta}
              />
            </InputWrapper>
            <InputWrapper>
              <NumberBox
                placeholder={intl.formatMessage({
                  id: 'components.DateInputBox.placeholder.year',
                  defaultMessage: 'Year'
                })}
                input={{
                  name: 'year',
                  value: input.value.year,
                  onBlur: this.onBlur.bind(this, 'year'),
                  onChange: this.onYearChange,
                  onFocus: this.onFocus
                }}
                meta={otherMeta}
              />
            </InputWrapper>
          </InputsWrapper>
        </RowWrapper>

        {meta.touched &&
          error && (
            <Error
              size='12px'
              weight={300}
              color='error'
              errorBottom={errorBottom}
            >
              {meta.error}
            </Error>
          )}
        {meta.touched &&
          !error &&
          meta.warning && (
            <Error
              size='12px'
              weight={300}
              color='sent'
              errorBottom={errorBottom}
            >
              {meta.warning}
            </Error>
          )}
      </Container>
    )
  }
}

export default injectIntl(DateInputBox)
