import React, { Component, Fragment } from 'react'
import { string, func } from 'prop-types'

import { isNameValid, isAliasUnique } from '../../utils/validations'
import { formatAlias } from '../../utils/contactUtils'
import tl from '../../utils/i18n'

import Input from '../Input'
import { Colors } from '../DesignSystem'
import { ErrorText } from '../AddressBook/AddressForm/elements'

class AccountNameInput extends Component {
  static propTypes = {
    pin: string.isRequired,
    accountName: string,
    onChangeText: func
  }

  static defaultProps = {
    onChangeText: () => {},
    accountName: ''
  }

  state = {
    accountNameError: null
  }

  _validateAccountName = async name => {
    if (name) {
      if (!isNameValid(name)) {
        return tl.t('addressBook.form.nameError')
      }

      const aliasIsUnique = await isAliasUnique(formatAlias(name), this.props.pin)
      if (!aliasIsUnique) {
        return tl.t('addressBook.form.uniqueAliasError')
      }
    }

    return null
  }

  _handleAccountNameChange = async accountName => {
    const accountNameError = await this._validateAccountName(accountName)

    this.setState({ accountNameError })
    this.props.onChangeText(accountName, accountNameError)
  }

  render () {
    const { accountNameError } = this.state
    const { accountName } = this.props

    return (
      <Fragment>
        <Input
          label={tl.t('addressBook.form.name')}
          value={accountName}
          onChangeText={this._handleAccountNameChange}
          placeholder={tl.t('newAccount.placeholder')}
          labelWrapperColor={Colors.dusk}
        />
        {!!accountNameError && (<ErrorText>{accountNameError}</ErrorText>)}
      </Fragment>
    )
  }
}

export default AccountNameInput
