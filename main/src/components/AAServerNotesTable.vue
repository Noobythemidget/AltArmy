<script>
import AABaseNotesTable from 'components/AABaseNotesTable.vue'

export default {
  extends: AABaseNotesTable,
  methods: {
    getName () {
      return 'AAServerNotesTable'
    },
    getRefreshEventName () {
      return 'get-server-notes'
    },
    getAddNoteEventName () {
      return 'add-server-note' // add-account-note
    },
    getUpdateNoteEventName () {
      return 'update-server-note' // update-account-note
    },
    getDeleteNoteEventName () {
      return 'delete-server-note' // delete-account-note
    }
  }
}
</script>
