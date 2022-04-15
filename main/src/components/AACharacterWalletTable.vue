<template>
  <div>
    <q-table
      ref="walletQTable"
      class="character-wallet-table plugin-data-view"
      :rows-per-page-options="[50]"
      :virtual-scroll-sticky-size-start="48"
      row-key="index"
      title="Wallet"
      loading-label="Loading wallet data..."
      no-results-label="Wallet is empty."
      v-model:columns="columns"
      v-model:rows="rows"
      :filter="search"
      @refresh="refresh"
      flat
    >

      <template v-slot:top>

        <q-toolbar class="table-toolbar">
          <q-icon name="account_balance" size="lg"></q-icon>
          <q-toolbar-title class="table-toolbar-title">Wallet</q-toolbar-title>
          <q-space />

          <q-chip :style="styleGold">{{this.gold.toLocaleString()}} gold</q-chip>
          <q-chip :style="styleSilver">{{this.silver.toLocaleString()}} silver</q-chip>
          <q-chip :style="styleCopper">{{this.copper.toLocaleString()}} copper</q-chip>

          <q-space />
          <q-input
            class="col-3 search-class"
            input-class="table-toolbar-textarea"
            label="Search"
            icon="search"
            rounded
            outlined
            dense
            clearable
            v-model="search"
            autogrow
            type="search"
          >
                  <!-- @update:model-value="handleStateChanged($event)" -->
                  <!-- <AATooltip :html="searchTooltip"></AATooltip> -->
          </q-input>
          <!-- <q-icon name="search" color="black" size="sm" /> -->
        </q-toolbar>

      </template>

    </q-table>
  </div>
</template>

<style lang="sass">
.character-wallet-table
  /* height or max-height is important */
  max-height: 50vh
  min-height: 50vh
  height: 50vh
  border-radius: $sub-table-border-radius  // rounded corner

  .q-table__top
    height: 65px

  // .q-table__top,
  // .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background: $sub-table-head-foot-background     // top and bottom of the table background color
    color: $sub-table-head-foot-text-icon           // label color in the header/footer

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  tbody
    // background: black
    // color: white
    tr:nth-child(2n)
      background: $sub-table-row-background-even
      color: $sub-table-row-text-even
    tr:nth-child(2n+1)
      background: $sub-table-row-background-odd
      color: $sub-table-row-text-odd
</style>

<script>
import { ref } from 'vue'
import { startLoading, stopLoading } from 'assets/js/util.js'
// const { startLoading, stopLoading } = require('assets/js/util.js')

export default {
  // name: 'ComponentName',
  props: {
    characterName: {
      type: String
    },
    account: {
      type: String
    },
    server: {
      type: String
    },
    gold: {
      type: Number,
      required: true,
      default: 0
    },
    silver: {
      type: Number,
      required: true,
      default: 0
    },
    copper: {
      type: Number,
      required: true,
      default: 0
    }
  },
  setup () {
    return {
      styleGold: 'background: gold;',
      styleSilver: 'background: #c0c0c0;',
      styleCopper: 'background: #b87333; color: white;',
      columns: [
        {
          name: 'currency_name',
          required: true,
          label: 'Currency',
          field: 'currency_name',
          align: 'left',
          sortable: true,
          style: 'width: 125px;'
        },
        {
          name: 'quantity',
          label: 'Quantity',
          field: 'quantity',
          align: 'left',
          sortable: true,
          style: 'width: 25px;',
          format: (val, row) => val.toLocaleString()
        },
        {
          name: 'type',
          label: 'Type',
          field: 'type',
          align: 'left',
          sortable: true
        // },
        // {
        //   name: 'description',
        //   label: 'Description',
        //   field: 'description',
        //   align: 'left',
        //   sortable: true,
        //   style: 'width: 150px; word-wrap: break-word;'
        }
      ],
      rows: ref([]),
      search: ref('')
    }
  },
  methods: {
    refresh () {
      console.log('AACharacterWalletTable.refresh')
      startLoading()
      window.invoke('get-character-wallet', this.characterName, this.account, this.server).then((result) => {
        this.rows = result.account.concat(result.personal).sort((first, second) => {
          return first.currency_name.localeCompare(second.currency_name)
        })
      }).finally(() => {
        stopLoading()
      })
    }
  }
}
</script>
