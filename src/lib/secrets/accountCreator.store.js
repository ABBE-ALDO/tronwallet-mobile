class AccountsCreatorStore {
  constructor (tron, client, oneSignal, secretsConnection, secretsStore) {
    this._tron = tron
    this._client = client
    this._oneSignal = oneSignal
    this._secretsConnection = secretsConnection
    this._secretsStore = secretsStore
  }

  async create (accountName, mnemonic) {
    if (!accountName || !mnemonic) {
      return null
    }

    const accounts = this._secretsStore.findAllAccounts()

    const userSecret = await this._tron.generateKeypair(mnemonic, accounts.length, false)

    userSecret.mnemonic = mnemonic
    userSecret.name = accountName
    userSecret.alias = this._secretsStore.formatAlias(accountName)
    userSecret.confirmed = true
    userSecret.hide = false

    await this._secretsConnection.save(userSecret)

    return userSecret
  }

  async createFirstAccount (mnemonic) {
    const accounts = this._secretsStore.findAllAccounts()
    if (accounts.length) {
      return null
    }

    return this.create('Main account', mnemonic)
  }

  async addAccountByMode (accountData, mode) {
    let account
    switch (mode) {
      case 'privateKey':
        account = this.addAccountByPrivateKeyMode(accountData)
        break
      case 'watch':
        account = this.addAccountByWatchMode(accountData)
        break
      default:
        account = this.addAccountByExistent(accountData)
    }

    if (account) {
      const oneSignalId = this._oneSignal.getOneSignalId()
      this._client.registerDeviceForNotifications(oneSignalId, account.address, false)
    }

    return account
  }

  async addAccountByPrivateKeyMode ({ accountName, address, privateKey }) {
    await this._secretsStore.checkAccount(address, privateKey)

    const userSecrets = {
      privateKey,
      address,
      publicKey: '',
      confirmed: true,
      mnemonic: '',
      password: '',
      hide: false,
      name: accountName,
      alias: this._secretsStore.formatAlias(accountName)
    }

    await this._secretsConnection.save(userSecrets)

    return userSecrets
  }

  async addAccountByWatchMode () {
    console.warn('test')
  }

  async addAccountByExistent ({ accountName }) {
    const firstAccount = this._secretsStore.findFirstAccount()
    if (!firstAccount) {
      return null
    }

    return this.create(accountName, firstAccount.mnemonic)
  }
}

export default AccountsCreatorStore
