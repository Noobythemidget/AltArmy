const { BaseTable, TYPE } = require('./base_table.js')

/**
 *
 */
class OnCharacterDeleteTrigger extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'on_character_delete_trigger', TYPE.TRIGGER)
  }

  /**
   * Sql for the trigger
   */

  sql = {

    /**
     * This trigger handles deleting characters, inventory_items and character_storage_details rows when
     * a new entry is added to the deleted_characters table.
     *
     * inventory_items and character_storage_details do not have a foreign key to the characters table, so
     * need to be deleted alongside the character.
     */
    create: `   CREATE TRIGGER IF NOT EXISTS on_character_delete 
                AFTER INSERT ON deleted_characters
                FOR EACH ROW
                BEGIN
                  DELETE FROM characters 
                  WHERE name            = NEW.name    AND 
                        account         = NEW.account AND 
                        server          = NEW.server;
                  DELETE FROM inventory_items
                  WHERE character_name  = NEW.name    AND 
                        account         = NEW.account AND 
                        server          = NEW.server;
                  DELETE FROM character_storage_details
                  WHERE name            = NEW.name    AND 
                        account         = NEW.account AND 
                        server          = NEW.server;
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

module.exports = { OnCharacterDeleteTrigger }
