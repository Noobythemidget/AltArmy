<script>
import AABaseNotesTable from 'components/AABaseNotesTable.vue'

export default {
  extends: AABaseNotesTable,
  methods: {
    getName () {
      return 'AACharacterNotesTable'
    },
    getRefreshEventName () {
      return 'get-character-notes'
    },
    getAddNoteEventName () {
      return 'add-character-note' // add-account-note
    },
    getUpdateNoteEventName () {
      return 'update-character-note' // update-account-note
    },
    getDeleteNoteEventName () {
      return 'delete-character-note' // delete-account-note
    }
  }
}
</script>
