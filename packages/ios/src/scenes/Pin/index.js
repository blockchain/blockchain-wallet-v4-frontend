
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, StyleSheet, Text, View } from 'react-native'
import images from '@assets/images'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  logo: { marginTop: 100 },
  numberPad: {
    alignContent: 'center',
    backgroundColor: '#004A7C',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    maxHeight: 280,
    justifyContent: 'center',
    width: '100%'
  },
  numberPadButton: {
    alignItems: 'center',
    flexBasis: '33.33%',
    justifyContent: 'center',
    height: 65
  },
  numberPadButtonTitle: {
    color: '#FFF',
    fontSize: 25,
    textAlign: 'center'
  },
  pinEntry: {
    borderColor: '#004A7C',
    borderWidth: 1,
    borderRadius: 15,
    height: 30,
    margin: 10,
    width: 30
  },
  pinEntryField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  pinLabel: {
    color: '#004A7C',
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 50
  },
  swipeToRequest: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    flex: 0.2,
    flexDirection: 'row',
    marginBottom: 10,
    marginRight: 10
  },
  swipeToRequestLabel: {
    color: '#004A7C',
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '500'
  },
  swipeToRequestArrow: { marginLeft: 10 }
})

export default class Pin extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Image source={images.bc_logo} style={styles.logo} />
        <Text style={styles.pinLabel}>Enter PIN</Text>
        <PinEntryField />
        <SwipeToRequest />
        <NumberPad />
      </View>
    )
  }
}

class PinEntryField extends Component {
  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps)
  }

  render() {
    return (
      <View style={styles.pinEntryField}>
        <View style={styles.pinEntry} />
        <View style={styles.pinEntry} />
        <View style={styles.pinEntry} />
        <View style={styles.pinEntry} />
      </View>
    )
  }
}

class SwipeToRequest extends Component {
  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps)
  }

  render() {
    return (
      <View style={styles.swipeToRequest}>
        <Text style={styles.swipeToRequestLabel}>Swipe to Request</Text>
        <Image source={images.swipeToRequestArrow} style={styles.swipeToRequestArrow} />
      </View>
    )
  }
}

class NumberPad extends Component {
  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps)
  }

  render() {
    return (
      <View style={styles.numberPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
          <NumberPadButton content={item} key={"num-" + item} />
        ))}
        <NumberPadButton />
        <NumberPadButton content="0" />
        <NumberPadButton image={images.back} />
      </View>
    )
  }
}

class NumberPadButton extends Component {
  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps)
  }

  render() {
    const { content, image } = this.props
    return (
      <View style={styles.numberPadButton}>
        {(image ? <Image source={image} /> : <Text style={styles.numberPadButtonTitle}>{content}</Text>)}
      </View>
    )
  }
}
