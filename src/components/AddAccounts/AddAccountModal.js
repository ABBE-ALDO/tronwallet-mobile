import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MixPanel from 'react-native-mixpanel'

import tl from '../../utils/i18n'
import { createNewAccount } from '../../utils/secretsUtils'
import { logSentry } from '../../utils/sentryUtils'

import Modal from '../Modal'
import ButtonGradient from '../ButtonGradient'
import { View } from '../Utils'
import { Colors } from '../DesignSystem'

import ModalHeader from './ModalHeader'
import AccountNameInput from './AccountNameInput'
import AccountTypeSelector from './AccountTypeSelector'

class AddAccountModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
    onCreated: PropTypes.func,
    oneSignalId: PropTypes.string.isRequired,
    pin: PropTypes.string.isRequired,
    totalAccounts: PropTypes.number.isRequired
  }

  static defaultProps = {
    onCreated: () => {},
    visible: false
  }

  state = {
    accountName: '',
    accountNameInvalid: false,
    key: null,
    accountData: {}
  }

  _changeAccountName = (accountName, error) =>
    this.setState({ accountName, accountNameInvalid: !!error })

  _onChangeData = (data) => {
    const { key, accountData } = this.state
    this.setState({ accountData: { ...accountData, [key]: data } })
  }

  _onSelectType = (key) => this.setState({ key })

  _addNewAccount = async () => {
    this.setState({ creatingNewAccount: true, accountModalVisible: false })

    try {
      const { accountName } = this.state
      const { pin, oneSignalId } = this.props

      const createdNewAccount = await createNewAccount(pin, oneSignalId, accountName)
      if (createdNewAccount) {
        return
      }

      this.props.onCreated()

      MixPanel.trackWithProperties('Account Operation', { type: 'Create new account' })
    } catch (error) {
      logSentry(error, 'Error creating new Account')
    } finally {
      this.setState({ creatingNewAccount: false })
    }
  }

  _disableAddAccount = () => {
    const { accountNameInvalid, key, accountData } = this.state
    let { valid } = accountData[key] || {}

    if (valid === undefined) {
      valid = key === 'default'
    }

    return accountNameInvalid || !valid
  }

  render () {
    const {
      visible,
      closeModal,
      pin,
      totalAccounts
    } = this.props

    const addAccountDisabled = this._disableAddAccount()

    return (
      <Modal
        modalOpened={visible}
        closeModal={closeModal}
        animationType='fade'
        transparent
      >
        <View flex={1} justify='center' background={Colors.shadowBackground} padding={15}>
          <View borderRadius={5} background={Colors.dusk} padding={15}>
            <ModalHeader
              title={tl.t('newAccount.title')}
              onClose={closeModal}
            />
            <AccountNameInput
              pin={pin}
              totalAccounts={totalAccounts}
              onChangeText={this._changeAccountName}
            />
            <AccountTypeSelector
              onSelectType={this._onSelectType}
              onChangeData={this._onChangeData}
            />
            <ButtonGradient
              text={tl.t(`import.button.create`)}
              onPress={this._addNewAccount}
              disabled={addAccountDisabled}
            />
          </View>
        </View>
      </Modal>
    )
  }
}

export default AddAccountModal