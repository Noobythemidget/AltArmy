const { BaseTable, TYPE } = require('./base_table.js')

/**
 *
 */
class OnCharacterInsertTrigger extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'on_character_insert_trigger', TYPE.TRIGGER)
  }

  /**
   * Sql for the trigger
   */

  sql = {

    /**
     * This trigger handles inserting to the characters table.
     * It will check to see if a character does not exist in the deleted_characters table before inserting.
     */
    create: ` CREATE TRIGGER IF NOT EXISTS on_character_insert
              INSTEAD OF INSERT ON characters_view
              FOR EACH ROW WHEN NOT EXISTS 
              (
                SELECT * 
                FROM deleted_characters 
                WHERE name          = NEW.name      AND 
                      account       = NEW.account   AND 
                      server        = NEW.server    AND 
                      last_updated >= NEW.last_updated
              )
              BEGIN
                INSERT INTO characters (
                  name, 
                  account, 
                  server, 
                  class, 
                  race, 
                  level, 
                  alignment, 
                  money, 
                  vocation, 
                  last_updated, 
                  plugin_version
                ) VALUES (
                  NEW.name, 
                  NEW.account, 
                  NEW.server, 
                  NEW.class, 
                  NEW.race, 
                  NEW.level, 
                  NEW.alignment, 
                  NEW.money, 
                  NEW.vocation, 
                  NEW.last_updated, 
                  NEW.plugin_version
                );
                DELETE FROM deleted_characters 
                WHERE name    = NEW.name    AND
                      account = NEW.account AND
                      server  = NEW.server;
              END;`
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
}

module.exports = { OnCharacterInsertTrigger }
