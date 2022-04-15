const { BaseTable, TYPE } = require('./base_table.js')

class AccountWallet extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'account_wallet', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */
  sql = {

    create: ` CREATE TABLE IF NOT EXISTS account_wallet (
                  currency_name   TEXT,
                  quantity        INTEGER,
                  account         TEXT,
                  server          TEXT,
                  PRIMARY KEY     (currency_name, account, server)
                );`,

    insert: ` INSERT OR IGNORE INTO account_wallet (
                  currency_name, 
                  quantity, 
                  account, 
                  server
                ) VALUES (
                  ?, 
                  ?, 
                  ?, 
                  ?
                );`,

    // need to escape \'Account'\ because it is also the name of a columen and "double qoutes" aren't working
    select: ` SELECT 
                currency_name, 
                quantity, 
                "Account" AS type, 
                d.description 
              FROM  account_wallet, 
                    wallet_descriptions AS d 
              WHERE account = ? AND 
                    server  = ? AND 
                    d.name  = currency_name 
              ORDER BY currency_name ASC;`
  }

  /**
   *
   * @returns
   */
  create () {
    return this.execSql(this.sql.create)
  }

  /**
   *
   */
  createSync () {
    this.execSqlSync(this.sql.create)
  }

  /// //////////////////////////////////////
  // helper methods
  /// //////////////////////////////////////

  // /**
  //  *
  //  * @param {*} currencyName
  //  * @param {*} quantity
  //  * @param {*} characterObj
  //  */
  // addWalletItem (currencyName, quantity, characterObj) {
  //   const array = [currencyName, quantity, characterObj.name, characterObj.account, characterObj.server]
  //   this.runSql(this.sql.insert, array)
  // }

  /**
   *
   * @param {*} account
   * @param {*} server
   * @param {*} walletObj
   */
  // add account wallet items to table
  add (account, server, walletObj) {
    const promiseArray = []
    for (const currencyName of Object.keys(walletObj)) {
      const qty = parseInt(walletObj[currencyName])
      promiseArray.push(this.runSql(this.sql.insert, currencyName, qty, account, server))
    }
    return Promise.all(promiseArray)
  }

  /**
   *
   * @param {*} account
   * @param {*} server
   * @returns
   */
  getAccountWallet (account, server) {
    return this.allSql(this.sql.select, account, server)
  }
}

module.exports = { AccountWallet }
