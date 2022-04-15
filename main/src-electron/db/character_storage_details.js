const { BaseTable, TYPE } = require('./base_table.js')

class CharacterStorageDetails extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'character_storage_details', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    create: `       CREATE TABLE IF NOT EXISTS character_storage_details (
                        name            TEXT NOT NULL,
                        account         TEXT NOT NULL,
                        server          TEXT NOT NULL,
                        vault_capacity  INTEGER,
                        vault_used      INTEGER,
                        bag_capacity    INTEGER,
                        bag_used        INTEGER,
                        PRIMARY KEY (name, account, server)
                    );`,

    insert: `       INSERT OR REPLACE INTO character_storage_details (
                        name, 
                        account, 
                        server
                    ) VALUES (
                        ?, 
                        ?, 
                        ?
                    );`,

    select: `       SELECT 
                        name, 
                        account, 
                        server, 
                        vault_capacity, 
                        vault_used, 
                        a.bag_capacity, 
                        a.bag_used, 
                        b.bag_capacity AS shared_storage_capacity, 
                        b.bag_used AS shared_storage_used
                    FROM 
                        character_storage_details AS a,
                        (
                            SELECT 
                                bag_capacity, 
                                bag_used 
                            FROM 
                                character_storage_details 
                            WHERE 
                                name    =   "Shared Storage"    AND 
                                account =   ?                   AND 
                                server  =   ?
                        ) AS b
                    WHERE 
                        a.name      = ? AND 
                        a.account   = ? AND 
                        a.server    = ?;`,

    update_vault: ` UPDATE character_storage_details 
                    SET vault_capacity  =   ?, 
                        vault_used      =   ? 
                    WHERE   name    =   ? AND 
                            account =   ? AND 
                            server  =   ?;`,

    update_bag: `   UPDATE character_storage_details 
                    SET     bag_capacity    = ?, 
                            bag_used        = ? 
                    WHERE   name    =   ? AND 
                            account =   ? AND 
                            server  =   ?;`

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
   * @param {*} characterName
   * @param {*} account
   * @param {*} server
   * @returns
   */
  add (characterName, account, server) {
    return this.runSql(this.sql.insert, characterName, account, server)
  }

  /**
   *
   * @param {*} characterName
   * @param {*} account
   * @param {*} server
   * @param {*} isVault
   * @param {*} capacity
   * @param {*} used
   * @returns
   */
  update (characterName, account, server, isVault, capacity, used) {
    const sqlStr = isVault ? this.sql.update_vault : this.sql.update_bag
    return this.runSql(sqlStr, capacity, used, characterName, account, server)
  }

  /**
   *
   * @param {*} characterName
   * @param {*} account
   * @param {*} server
   * @returns
   */
  getCharacterStroageDetails (characterName, account, server) {
    // passing account and server multiple times because they appear multiple times in the query
    return this.getSql(this.sql.select, account, server, characterName, account, server)
  }
}

module.exports = { CharacterStorageDetails }
