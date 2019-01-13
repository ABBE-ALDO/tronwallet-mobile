class SecretsStore {
  constructor (tron, secretsConnection, logger, client, contactsConnection) {
    this._tron = tron
    this._secretsConnection = secretsConnection
    this._logger = logger
    this._client = client
    this._contactsConnection = contactsConnection
  }

  createMnemonic () {}

  validateMnemonic () {}

  validatePin () {}

  signTransaction () {}

  getStoreByAccountType (accountType) {
    switch (accountType) {
      case 'User':
        return this._secretsConnection
      case 'Contact':
        return this._contactsConnection
      default:
        return null
    }
  }

  async removeByAccountType (address, accountType) {
    const store = this.getStoreByAccountType(accountType)
    await store.deleteByKey(address)
  }

  async resetSecretData () {
    await this._secretsConnection.resetData()
  }

  formatAlias (name) {
    return name && `@${name.trim().toLowerCase().replace(/ /g, '_')}`
  }

  findAllAccounts () {
    return this._secretsConnection.findAll() || []
  }

  findFirstAccount () {
    const accounts = this.findAllAccounts()
    return accounts[0]
  }

  findLastAccount () {
    const accounts = this.findAllAccounts()
    return accounts[accounts.length - 1]
  }

  findVisibleAccounts () {
    return this.findAllAccounts().filter(account => !account.hide)
  }

  async checkAccount (address, privateKey) {
    let exception = null

    try {
      const mockTransactionSigned = await this.generateMockTransactionSigned(address, privateKey)
      await this._client.broadcastTransaction(mockTransactionSigned)
    } catch (e) {
      exception = e
    }

    if (!exception) {
      return
    }

    const { data } = exception.response || {}

    if (!data) {
      return
    }

    if (data.type === 'INSUFICIENT_AMOUNT' || data.type === 'ACCOUNT_NOT_EXISTS') {
      return
    }

    if (data.error !== 'validate signature error') {
      this._logger(exception, 'Check Account response')
    }

    throw exception
  }

  async generateMockTransactionSigned (address, privateKey) {
    const mockTransaction = { from: address, to: 'TJo2xFo14Rnx9vvMSm1kRTQhVHPW4KPQ76', amount: 0, token: 'TRX' }
    const transactionUnsigned = await this._client.getTransferTransaction(mockTransaction)

    return this._tron.signTransaction(privateKey, transactionUnsigned)
  }

  get publicKey () {
    const account = this.findFirstAccount()
    return (account || {}).address
  }
}

export default SecretsStore
