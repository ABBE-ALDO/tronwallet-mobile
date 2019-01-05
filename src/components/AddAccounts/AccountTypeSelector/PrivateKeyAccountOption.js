import React, { Component } from 'react'
import { object, func } from 'prop-types'

import { View } from '../../Utils'
import AddressInput from '../../Import/AddressInput'
import PrivateKeyInput from '../../Import/PrivateKeyInput'
import accountOptionComponent from './AccountOption.hoc'
import { Colors } from '../../DesignSystem'

class PrivateKeyAccountOption extends Component {
  static propTypes = {
    onChangeData: func.isRequired,
    accountData: object
  }

  _changeAddress = ({ address, error }) => {
    const { accountData } = this.props
    accountData.address = address

    this.props.onChangeData(accountData, error)
  }

  _changePrivateKey = ({ privateKey, error }) => {
    const { accountData } = this.props
    accountData.privateKey = privateKey

    this.props.onChangeData(accountData, error)
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

export default accountOptionComponent(
  'privateKeyOption',
  {
    address: '',
    privateKey: ''
  },
  PrivateKeyAccountOption
)
