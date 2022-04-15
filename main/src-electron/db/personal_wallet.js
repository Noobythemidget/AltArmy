const { BaseTable, TYPE } = require('./base_table.js')

class PersonalWallet extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'personal_wallet', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */
  sql = {
    create: `   CREATE TABLE IF NOT EXISTS personal_wallet (
                    currency_name   TEXT    NOT NULL,
                    quantity        INTEGER NOT NULL,
                    character_name  TEXT    NOT NULL,
                    account         TEXT    NOT NULL,
                    server          TEXT    NOT NULL,
                    PRIMARY KEY (currency_name, character_name, account, server),
                    FOREIGN KEY (character_name, account, server)
                        REFERENCES characters (name, account, server)
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION
                );`,

    insert: `   INSERT OR IGNORE INTO personal_wallet (
                    currency_name, 
                    quantity, 
                    character_name, 
                    account, 
                    server
                ) VALUES (
                    ?, 
                    ?, 
                    ?, 
                    ?, 
                    ?
                );`,

    select: `   SELECT 
                    currency_name, 
                    quantity, 
                    "Personal" as type, 
                    d.description 
                FROM    personal_wallet, 
                        wallet_descriptions as d 
                WHERE   character_name  = ? AND 
                        account         = ? AND 
                        server          = ? AND 
                        d.name          = currency_name 
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

  /**
   *
   * @param {*} currencyName
   * @param {*} quantity
   * @param {*} characterObj
   * @returns
   */
  addWalletItem (currencyName, quantity, characterObj) {
    return this.runSql(this.sql.insert, currencyName, quantity, characterObj.name, characterObj.account, characterObj.server)
  }

  /**
   *
   * @param {*} characterName
   * @param {*} account
   * @param {*} server
   * @returns
   */
  getPersonalWallet (characterName, account, server) {
    return this.allSql(this.sql.select, characterName, account, server)
  }
}

module.exports = { PersonalWallet }
