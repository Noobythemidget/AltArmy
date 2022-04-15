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
          name: 'name',
          required: true,
          label: 'Name',
          field: 'name',
          align: 'left',
          sortable: true,
          style: 'width: 10%;'
        },
        {
          name: 'lotro_points',
          label: 'Lotro Points',
          field: 'lotro_points',
          align: 'right',
          sortable: true,
          style: 'width: 10%;',
          format: (val, row) => parseInt(val).toLocaleString(),

          // the remaining properties are defined by alt army
          tooltip: 'Click on a value to update LP.',
          editable: true,
          editableNumber: true,
          save: (row, col, value, initialValue) => {
            console.log('save lotro_points:', row, col, value, initialValue)
            window.invoke('update-account-lotropoints', row.id, value)
          },
          validate: (value) => {
            console.log('validate lotro_points:', value)
            return value >= 0
          }
        },
        {
          name: 'space',
          label: '',
          style: 'width: 90%'
        }
      ]
    }
  },
  methods: {
    getName () {
      return 'AAAccountsTable'
    },
    getLoadingLabel () {
      return 'Loading accounts data...' // Loading character data...
    },
    getNoResultsLabel () {
      return 'No accounts matched.' // No characters matched.
    },
    getStoreProperty () {
      return store.accounts // something like store.characters
    },
    getRefreshEventName () {
      return 'get-accounts-table'
    },
    getFilterType () {
      return FilterNode.FILTER_WALLET
    },
    getStoreFilter () {
      return store.accounts.toolbarOptions.search
    },
    filterMethod () {
      const searchStr = this.getStoreFilter() !== null ? this.getStoreFilter().toLowerCase() : ''
      const rows = this.getStoreProperty().rows

      return rows.filter((row) => {
        return row.name.toLowerCase().includes(searchStr) ||
           row.lotro_points.toString().includes(searchStr) ||
           parseInt(row.lotro_points).toLocaleString().includes(searchStr)
      })

      // return this.defaultFilterMethod()
    }
  }
}
</script>
