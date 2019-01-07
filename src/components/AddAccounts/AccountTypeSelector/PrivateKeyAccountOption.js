import React, { PureComponent } from 'react'
import { func } from 'prop-types'

import { View } from '../../Utils'
import AddressInput from '../../Import/AddressInput'
import PrivateKeyInput from '../../Import/PrivateKeyInput'
import { Colors } from '../../DesignSystem'

class PrivateKeyAccountOption extends PureComponent {
  static propTypes = {
    onChangeData: func.isRequired
  }

  state = {
    address: '',
    privateKey: '',
    addressError: null,
    privateKeyError: null,
    valid: false
  }

  _changeAddress = (address, addressError) =>
    this.setState({ address, addressError }, this._changeData)

  _changePrivateKey = (privateKey, privateKeyError) =>
    this.setState({ privateKey, privateKeyError }, this._changeData)

  _changeData = () => {
    const { address, privateKey, addressError, privateKeyError } = this.state
    const valid = address && privateKey && !addressError && !privateKeyError

    this.props.onChangeData({ address, privateKey, valid })
  }

  render () {
    return (
      <View marginTop={15}>
        <AddressInput
          labelWrapperColor={Colors.dusk}
          onChangeText={this._changeAddress}
        />
        <PrivateKeyInput
          labelWrapperColor={Colors.dusk}
          onChangeText={this._changePrivateKey}
        />
      </View>
    )
  }
}

export default PrivateKeyAccountOption
