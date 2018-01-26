
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'
import { BarButtonItem } from '../BarButtonItem'
import images from '@assets/images'

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#004A7C",
    flexDirection: "row",
    height: 150,
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 16
  },
})

export default class NavigationBar extends Component {
  render() {
    const { leftItem, rightItem, title } = this.props
    return (
      <View style={styles.container}>
        {leftItem}{title}{rightItem}
      </View>
    )
  }
}

NavigationBar.propTypes = {
  leftItem: PropTypes.element,
  rightItem: PropTypes.element,
  title: PropTypes.element,
}
