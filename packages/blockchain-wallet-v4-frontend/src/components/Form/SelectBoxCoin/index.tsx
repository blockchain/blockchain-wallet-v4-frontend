import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Icon, SkeletonRectangle, Text } from 'blockchain-info-components'

import SelectBox from '../SelectBox'
import { getData } from './selectors'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-overflow: ellipsis;
  & > :first-child {
    margin-right: 5px;
  }
`

class SelectBoxCoin extends React.PureComponent<Props> {
  renderItem = (props) => {
    const { text, value, ...rest } = props
    return (
      <HeaderWrapper {...rest}>
        <Icon name={value} size='20px' />
        <Text size='14px' cursor='pointer' data-e2e=''>
          {text}
        </Text>
      </HeaderWrapper>
    )
  }

  renderDisplay = (props, children) => {
    const { value, ...rest } = props
    const e2eTag = value ? `${value.toLowerCase()}CurrencyOption` : 'currencyOption'
    return (
      <HeaderWrapper {...rest}>
        <Icon name={value} size='20px' />
        <Text size='16px' cursor='pointer' data-e2e={e2eTag} weight={500}>
          {children}
        </Text>
      </HeaderWrapper>
    )
  }

  render() {
    // @ts-ignore
    const { additionalOptions = [], limitTo = [], ...rest } = this.props

    return this.props.data.cata({
      Failure: (message) => <div>{message}</div>,
      Loading: () => <SkeletonRectangle height='48px' width='100%' />,
      NotAsked: () => <SkeletonRectangle height='48px' width='100%' />,
      Success: (val) => {
        return (
          <SelectBox
            elements={[
              {
                group: '',
                items:
                  limitTo.length > 0
                    ? [...additionalOptions, ...limitTo]
                    : [...additionalOptions, ...val]
              }
            ]}
            templateDisplay={this.renderDisplay}
            templateItem={this.renderItem}
            zIndex={3}
            {...rest}
          />
        )
      }
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(SelectBoxCoin)
