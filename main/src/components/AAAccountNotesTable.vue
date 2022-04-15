<script>
import AABaseNotesTable from 'components/AABaseNotesTable.vue'

export default {
  extends: AABaseNotesTable,
  methods: {
    getName () {
      return 'AAAccountNotesTable'
    },
    getRefreshEventName () {
      return 'get-account-notes'
    },
    getAddNoteEventName () {
      return 'add-account-note' // add-account-note
    },
    getUpdateNoteEventName () {
      return 'update-account-note' // update-account-note
    },
    getDeleteNoteEventName () {
      return 'delete-account-note' // delete-account-note
    }
  }
}
</script>
