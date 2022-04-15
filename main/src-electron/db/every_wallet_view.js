const { BaseTable, TYPE } = require('./base_table.js')

class EveryWalletView extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'every_wallet_view', TYPE.VIEW)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    create: `   CREATE VIEW IF NOT EXISTS every_wallet_view (
                    currency_name,
                    quantity,
                    type,
                    locations
                ) 
                AS
                SELECT 
                    currency_name, 
                    sum(quantity) AS quantity, 
                    'Character' AS type, 
                    json("[" || group_concat(location) || "]") AS locations
                FROM 
                    (
                        SELECT 
                            currency_name, 
                            sum(quantity) AS quantity,
                            json_object(    'category',     'wallet',
                                            'sub_category', 'character',                                             
                                            'account',      account,
                                            'server',       server,
                                            'character',    character_name,
                                            'quantity',     sum(quantity)
                                        ) AS location
                        FROM 
                            personal_wallet 
                        GROUP BY 
                            currency_name, 
                            account, 
                            server, 
                            character_name 
                        ORDER BY 
                            currency_name, 
                            location
                    )
                GROUP BY currency_name
                UNION ALL
                SELECT 
                    currency_name, 
                    sum(quantity)   AS quantity, 
                    'Account'       AS type,
                    json("[" || group_concat(location) || "]") AS locations
                FROM 
                    (
                        SELECT 
                            currency_name, 
                            sum(quantity) AS quantity,
                            json_object(    'category',     'wallet',
                                            'sub_category', 'account',
                                            'account',      account, 
                                            'server',       server,
                                            'quantity',     sum(quantity)
                                        ) AS location
                        FROM 
                            account_wallet 
                        GROUP BY 
                            currency_name, 
                            account, 
                            server 
                        ORDER BY 
                            currency_name, 
                            location
                    )
                GROUP BY 
                    currency_name
                ORDER BY 
                    currency_name, 
                    locations;`

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
   * @returns
   */
  getEveryWallet () {
    return this.selectAll()
  }
}

module.exports = { EveryWalletView }
