import React from 'react'

import TabMenuNftSaleTypeTemplate from './template'

class TabMenuNftSaleType extends React.PureComponent {
  handleClick = (value) => {
    // @ts-ignore
    this.props.input.onChange(value)
  }

  render() {
    return (
      <TabMenuNftSaleTypeTemplate
        // @ts-ignore
        value={this.props.input.value}
        handleClick={this.handleClick}
      />
    )
  }
}

export default TabMenuNftSaleType
