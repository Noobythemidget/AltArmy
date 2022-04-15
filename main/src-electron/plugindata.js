const { app, dialog } = require('electron')
const path = require('path')
const { platform } = require('os')
const { existsSync, readdirSync, readFileSync } = require('fs')
const { Logger } = require('./logger.js')

// const { access, readdir, readFile } = require('fs/promises')
// const { constants } = require('fs')

// returns the default path to use in the dialog
/**
 *
 * @returns
 */
function getDefaultLotroDir () {
  const dir = app.getPath('documents') + path.sep + 'The Lord of the Rings Online' + path.sep + 'PluginData'
  if (platform() === 'win32' && existsSync(dir)) {
    return dir
  } else {
    return app.getPath('home')
  }
}

// opens dialog to get plugin data directory
/**
 *
 * @param {*} window
 * @returns
 */
function getPluginDataDir (window) {
  return dialog.showOpenDialog(window, {
    title: 'Open LOTRO PluginData Directory',
    message: 'Open LOTRO PluginData Directory',
    defaultPath: getDefaultLotroDir(),
    properties: ['openDirectory']
  })
}

/**
 *
 */
class PluginData {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    this.db = db
    this.walletItemDescriptions = []
    this.servers = []
    this.accounts = []
    this.characters = []
    this.inventory = []
    this.storageDetails = []
  }

  /**
   *
   * @param {*} dir
   */
  loadPluginData (dir) {
    this.buildPDObj(dir)
    this.populateDB()
  }

  /**
   *
   * @param {*} dir
   */
  buildPDObj (dir) {
    Logger.log('buildPDObj begin')
    const accounts = readdirSync(dir)
    for (const account of accounts) {
      const accountPath = dir + path.sep + account
      const servers = readdirSync(accountPath)
      for (const server of servers) {
        if (server !== 'AllServers') {
          // this path for alt army data
          const altArmyDatafile = accountPath + path.sep + server + path.sep + 'AllCharacters' + path.sep + 'AltArmy.plugindata'
          if (existsSync(altArmyDatafile)) {
            const data = readFileSync(altArmyDatafile, { encoding: 'utf-8' })
            Logger.log(altArmyDatafile)
            const json = this.#lua2Json(data)
            this.#addData(account, server, json)
          }

          // this path for alt inventory data
          const altInventoryDatafile = accountPath + path.sep + server + path.sep + 'AllCharacters' + path.sep + 'AltInventoryData.plugindata'
          if (existsSync(altInventoryDatafile)) {
            const data = readFileSync(altInventoryDatafile, { encoding: 'utf-8' })
            Logger.log(altInventoryDatafile)
            const json = this.#lua2Json(data)
            this.#addAltInvData(account, server, json)
          }

          const altInventoryCharListfile = accountPath + path.sep + server + path.sep + 'AllCharacters' + path.sep + 'AltInventoryCharList.plugindata'
          if (existsSync(altInventoryCharListfile)) {
            const data = readFileSync(altInventoryCharListfile, { encoding: 'utf-8' })
            Logger.log(altInventoryCharListfile)
            const json = this.#lua2Json(data)
            this.#addAltInvCharList(account, server, json)
          }
        }
      }
    }

    Logger.log('buildPDObj end')
  }

  /**
   *
   */
  async populateDB () {
    Logger.log('populateDB begin')

    Logger.log('creating backups')
    this.db.beginTransaction()
    this.db.backupSync()

    this.db.deleteAllRecords()

    /// ///
    // Alt Army stuff
    /// ///

    // wallet item descriptions
    Logger.log('wallet description')
    for (const [walletItemName, description] of Object.entries(this.walletItemDescriptions)) {
      this.db.WalletDescriptions.add(walletItemName, description)
    }

    // accounts
    Logger.log('accounts')
    for (const [accountName, accountObj] of Object.entries(this.accounts)) {
      this.db.Accounts.add(accountName)
      for (const [serverName, wallet] of Object.entries(accountObj.wallets)) {
        this.db.AccountWallet.add(accountName, serverName, wallet)
      }
    }

    // servers
    Logger.log('servers')
    for (const serverName of Object.keys(this.servers)) {
      this.db.Servers.add(serverName)
    }

    // characters
    Logger.log('characters')
    for (const toon of this.characters) {
      this.db.Characters.add(toon).catch()
    }

    this.db.endTransaction()

    Logger.log('restoring backups')
    this.db.restoreSync()

    /// ///
    // Alt Inventory stuff
    /// ///
    this.db.beginTransaction()

    // inventory
    Logger.log('inventory')
    for (const item of this.inventory) {
      this.db.InventoryItems.add(item)
    }

    // storage details
    Logger.log('storage details')
    for (const details of this.storageDetails) {
      this.db.CharacterStorageDetails.add(details.character, details.account, details.server)
      this.db.CharacterStorageDetails.update(details.character, details.account, details.server, details.vault, details.capacity, details.used)
    }

    this.db.endTransaction()

    Logger.log('populateDB end')
  }

  /**
   *
   * @param {*} account
   * @param {*} server
   * @param {*} data
   */
  // private - adds data from a plugindata file to this object
  #addData (account, server, data) {
    if (typeof data.WalletItemDescriptions !== 'undefined') {
      // save wallet description, it's ok to overwrite
      for (const key in data.WalletItemDescriptions) {
        this.walletItemDescriptions[key] = data.WalletItemDescriptions[key]
      }
    }

    // create account
    if (typeof this.accounts[account] === 'undefined') {
      this.accounts[account] = new Account(account)
    }
    if (typeof data.AccountWallet !== 'undefined') {
      this.accounts[account].setWallet(server, data.AccountWallet) // TODO need to add server
    }
    // create server
    if (typeof this.servers[server] === 'undefined') {
      this.servers[server] = new Server(server)
    }
    // create characters and add to account
    if (typeof data.CharacterList !== 'undefined') {
      for (const charName in data.CharacterList) {
        const toon = new Character(charName, account, server, data.CharacterList[charName])
        this.servers[server].characters.push(toon)
        this.accounts[account].characters.push(toon)
        this.characters.push(toon)
      }
    }
  }

  /**
   *
   * @param {*} account
   * @param {*} server
   * @param {*} data
   */
  #addAltInvData (account, server, data) {
    // Logger.log('addAltInvData')
    for (const itemName of Object.keys(data)) {
      const item = new InventoryItem(itemName, account, server, data[itemName])
      this.inventory.push(item)
    }
  }

  /**
   *
   * @param {*} account
   * @param {*} server
   * @param {*} data
   */
  #addAltInvCharList (account, server, data) {
    Logger.log('addAltInvCharList')
    // Logger.log(data)
    for (const key of Object.keys(data)) {
      const vault = key.endsWith(' (Vault)')
      const characterName = key.replace(' (Vault)', '')
      const capacity = data[key].capacity
      const used = data[key].used

      this.storageDetails.push({
        character: characterName,
        account: account,
        server: server,
        vault: vault,
        capacity: capacity,
        used: used
      })
    }
  }

  /**
   *
   * @param {*} lua
   * @returns
   */
  // private -
  #lua2Json (lua) {
    return JSON.parse(lua.replace('return', '').replaceAll('["', '"').replaceAll('"] =', '" :'))
  }
}

/**
 *
 */
class Character {
  /**
   *
   * @param {*} name
   * @param {*} account
   * @param {*} server
   * @param {*} data
   */
  constructor (name, account, server, data) {
    this.name = name
    this.account = account
    this.server = server
    this.data = data

    if (this.data.Class === 'Undefined') {
      this.data.Class = 'Creep'
    }
  }

  // format of 'data'
  // {
  //   Alignment: String,
  //   Class: String,
  //   LastUpdate: [String, Date/Time],
  //   Level: Number,
  //   Money: Number,
  //   PersonalWallet: {Obj},
  //   PluginVersion: String,
  //   Race: String
  // }
  // format of 'PersonalWallet'
  // {
  //   CurrencyName: Qty
  // }
  // example:
  // {
  //   "Anniversary Token": "75"
  // }
}

/**
 *
 */
class Account {
  /**
   *
   * @param {*} name
   */
  constructor (name) {
    this.name = name
    this.wallets = []
    this.characters = []
  }

  /**
   *
   * @param {*} server
   * @param {*} data
   */
  // TODO this is wrong because each account/server has it's own wallet
  setWallet (server, data) {
    if (data !== undefined && data !== null) {
      this.wallets[server] = {}
      for (const currencyName of Object.keys(data)) {
        const qty = parseInt(data[currencyName])
        this.wallets[server][currencyName] = qty
      }
    }
  }
}

/**
 *
 */
class Server {
  /**
   *
   * @param {*} name
   */
  constructor (name) {
    this.name = name
    this.characters = []
  }
}

// format of 'data'
// {
//   Total: Number,
//   SortCategory: Number/String?,
//   BackgroundImageID: String,
//   Qty: {Obj},
//   IconImageID: String,
//   Category: String,
//   Quality: String
// }
// format of 'Obj'
// {
//   {ItemLocation}: {Obj},  ---> {ItemLocation} is a key and will have the value like 'Nooby (Vault)'
//    ...                    ---> there will be an entryy for each location this item is in
// }
// format of {ItemLcoation}
// {
//   Subtotal: Number,
//   {ChestName}: Number     ---> {ChestName} is a key and will have the name of the chest or bag like '2'
//    ...                    ---> there will be an entryy for each chest/bag this item is in
// }
// example:
// {
//   "Anniversary Token": "75"
// }
class InventoryItem {
  /**
   *
   * @param {*} name
   * @param {*} account
   * @param {*} server
   * @param {*} data
   */
  constructor (name, account, server, data) {
    this.name = name
    this.account = account
    this.server = server

    this.data = data

    this.containers = {}

    // handle the QTY
    // ["Qty"] =
    // {
    //    ["CharName1"] =
    //    {
    //      ["Subtotal"] = "1",
    //      ["8"] = "1"
    //    },
    //    ["CharName1 (Vault)"] =
    //    {
    //      ["Subtotal"] = "1",
    //      ["5"] = "1"
    //    }
    // ...
    // }

    if (this.data.Qty !== undefined) {
      for (const key of Object.keys(this.data.Qty)) {
        const containerKey = key.replaceAll(' (Vault)', '') // usually the character name but sometimes "Shared Storage"
        const vault = key.endsWith(' (Vault)')

        if (this.containers[containerKey] === undefined) {
          this.containers[containerKey] = {}
        }

        for (const subContainerKey of Object.keys(this.data.Qty[key])) {
          if (subContainerKey !== 'Subtotal') {
            const quantity = this.data.Qty[key][subContainerKey]
            this.containers[containerKey][subContainerKey] = {
              vault: vault,
              quantity: quantity
            }
          }
        }
      }
    }
  }
}

module.exports = { getPluginDataDir, PluginData }
