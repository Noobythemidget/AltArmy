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
          name: 'currency_name',
          required: true,
          label: 'Name',
          field: 'currency_name',
          align: 'left',
          sortable: true,
          style: 'width: 15%;'
        },
        {
          name: 'quantity',
          label: 'Quantity',
          field: 'quantity',
          align: 'left',
          sortable: true,
          style: 'width: 10%;',
          format: (val, row) => val.toLocaleString()
        },
        {
          name: 'type',
          required: true,
          label: 'Type',
          field: 'type',
          align: 'left',
          sortable: true,
          style: 'width: 100%;'
        }
      ]
    }
  },
  methods: {
    getName () {
      return 'AAWalletTable'
    },
    getLoadingLabel () {
      return 'Loading wallet data...' // Loading character data...
    },
    getNoResultsLabel () {
      return 'No wallet items matched.' // No characters matched.
    },
    getStoreProperty () {
      return store.wallet // something like store.characters
    },
    getRefreshEventName () {
      return 'get-every-wallet'
    },
    getFilterType () {
      return FilterNode.FILTER_WALLET
    }
  }
}
</script>
