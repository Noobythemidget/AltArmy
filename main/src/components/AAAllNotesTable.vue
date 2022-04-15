<script>
import AABaseTable from 'components/AABaseTable.vue'
import { store } from 'assets/js/store.js'
import { FilterNode } from 'assets/js/filternode.js'

export default {
  extends: AABaseTable,
  setup () {
    return {
      columns: [
        {
          name: 'timestamp',
          required: true,
          label: 'Timestamp',
          field: 'timestamp',
          align: 'left',
          sortable: true,
          style: 'width: 25px;'
        },
        {
          name: 'type',
          required: true,
          label: 'Type',
          field: 'source',
          align: 'left',
          sortable: true,
          style: 'width: 25px;',
          format: (value) => {
            return value.replace('_notes', '')
          }
        },
        {
          name: 'entity',
          required: true,
          label: 'Entity',
          field: 'entity',
          align: 'left',
          sortable: true,
          style: 'width: 50px;'
        },
        {
          name: 'note',
          label: 'Note',
          field: 'note',
          align: 'left',
          sortable: true,
          style: 'width: 100%;',

          // the following properties are defined by alt army
          tooltip: 'Click on a note to edit it.',
          html: true,
          editable: true,
          editableNote: true,
          save: (row, col, value, initialValue) => {
            console.log('edit note:', row, col, value, initialValue)

            const updateEventNames = {
              character_notes: 'update-character-note',
              account_notes: 'update-account-note',
              server_notes: 'update-server-note'
            }
            window.invoke(updateEventNames[row.source], row.id, value)

            // switch (row.source) {
            //   case 'character_notes':
            //     window.invoke('update-character-note', row.id, value)
            //     break
            //   case 'account_notes':
            //     window.invoke('update-account-note', row.id, value)
            //     break
            //   case 'server_notes':
            //     window.invoke('update-server-note', row.id, value)
            //     break
            // }
          }

        }
      ]
    }
  },
  methods: {
    getName () {
      return 'AAAllNotesTable'
    },
    getLoadingLabel () {
      return 'Loading notes data...' // Loading character data...
    },
    getNoResultsLabel () {
      return 'No notes matched.' // No characters matched.
    },
    getStoreProperty () {
      return store.all_notes // something like store.characters
    },
    getRefreshEventName () {
      return 'get-all-notes'
    },
    getFilterType () {
      return FilterNode.FILTER_WALLET
    },
    getStoreFilter () {
      return store.all_notes.toolbarOptions.search
    },
    filterMethod () {
      return this.defaultFilterMethod()
    }
  },
  beforeMount () {
    this.refresh()
  }
}
</script>
