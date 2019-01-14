export class UserSecret {

}

UserSecret.schema = {
  name: 'UserSecret',
  primaryKey: 'address',
  properties: {
    confirmed: 'bool',
    address: 'string',
    password: 'string',
    mnemonic: 'string',
    privateKey: 'string',
    publicKey: 'string',
    name: 'string',
    alias: 'string',
    hide: 'bool',
    order: 'int',
    type: 'string',
    coin: 'string',
    meta: 'string?'
  }
}

export class Contact {

}

Contact.schema = {
  name: 'Contact',
  primaryKey: 'address',
  properties: {
    address: 'string',
    name: 'string',
    alias: 'string'
  }
}
