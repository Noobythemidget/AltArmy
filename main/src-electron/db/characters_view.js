const { BaseTable, TYPE } = require('./base_table.js')

class CharactersView extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'characters_view', TYPE.VIEW)
  }

  /**
   * This object contains all the sql statements for the characters table
   */
  sql = {
    create: `   CREATE VIEW IF NOT EXISTS characters_view (
                    name, 
                    account, 
                    server, 
                    class, 
                    race, 
                    level, 
                    alignment, 
                    money, 
                    gold,
                    silver, 
                    copper, 
                    vocation, 
                    last_updated,
                    plugin_version
                )
                AS
                SELECT 
                    c.name, 
                    a.name, 
                    s.name, 
                    c.class, 
                    c.race, 
                    c.level, 
                    c.alignment,
                    c.money, 
                    c.money / 100000 as gold, 
                    c.money  % 100000 / 100 as silver, 
                    c.money % 100 as copper,
                    c.vocation, 
                    c.last_updated,
                    c.plugin_version
                FROM 
                    characters AS c, 
                    accounts AS a, 
                    servers AS s
                WHERE 
                    c.account=a.name AND 
                    c.server=s.name
                ORDER BY 
                    c.account ASC, 
                    c.server ASC, 
                    c.level DESC, 
                    c.name ASC
                    ;`,

    select_by_account: `    SELECT
                                *
                            FROM
                                characters_view
                            WHERE
                                account = ?;`,

    select_by_server: `     SELECT
                                *
                            FROM
                                characters_view
                            WHERE
                                server = ?;`
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
  getAllCharacters () {
    return this.selectAll()
  }

  /**
   *
   * @param {*} account
   * @returns
   */
  getAllCharactersForAccount (account) {
    return this.allSql(this.sql.select_by_account, account)
  }

  /**
   *
   * @param {*} server
   * @returns
   */
  getAllCharactersForServer (server) {
    return this.allSql(this.sql.select_by_server, server)
  }
}

module.exports = { CharactersView }
