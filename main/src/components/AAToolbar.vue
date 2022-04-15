<template>
  <q-toolbar class="table-toolbar">
    <q-icon v-if="icon" :name="icon" size="lg"></q-icon>
    <q-toolbar-title class="table-toolbar-title">{{ label }}</q-toolbar-title>
    <q-space></q-space>
    <AAToolbarBtnDropdown
      v-for="(dropdownOption,index) in toolbarOptions.dropdownOptions"
      :key="index"
      ref="dropdowns"
      no-caps
      :label="dropdownOption.label"
      :options="dropdownOption.options"
      @stateChanged="handleStateChanged($event)"
    ></AAToolbarBtnDropdown>
    <q-input
      class="col-3 q-px-md search-class"
      label="Search"
      input-class="table-toolbar-textarea"
      icon="search"
      outlined
      rounded
      dense
      clearable
      v-model="search"
      autogrow
      type="search"
      @update:model-value="handleStateChanged($event)"
    >
      <AATooltip :html="searchTooltip"></AATooltip>
    </q-input>
    <!-- <q-icon name="search" color="white" size="sm" /> -->
  </q-toolbar>
</template>

<style lang="sass">
.table-toolbar-title
  user-select: none

.table-toolbar-textarea
  color: $top-table-head-foot-text-icon
  // .q-btn--actionable
  //   color: red

// this is for the 'Search' label inside the text area
.q-field__control-container
  .q-field__label,
  .q-field__append
    color: $top-table-head-foot-text-icon

// this is for the 'x' icon in the search field to clear input
.search-class
  .q-field__inner
    .q-field__control
      .q-field__append
        .q-icon
          color: $top-table-head-foot-text-icon // the 'x' icon in search field to clear contents
      color: $top-table-head-foot-text-icon // this is the border of the search filed when focused
</style>

<script>
import { ref } from 'Vue'
import AAToolbarBtnDropdown from 'components/AAToolbarBtnDropdown.vue'
import AATooltip from 'components/AATooltip.vue'
import { aatoolbar, AAToolbarOptions } from 'assets/js/aatoolbar.js'
import { Logger } from 'assets/js/logger.js'

export default {
  // name: 'ComponentName',
  components: {
    AAToolbarBtnDropdown,
    AATooltip
  },
  emits: ['stateChanged'],
  props: {
    // --------
    // Format:
    // --------
    // filter {
    //   search: '',
    //   dropdownOptions: [
    //     { AABtnDropdownOptions },  <-- see aatoolbar.js
    //     { AABtnDropdownOptions },
    //     ...
    //   ]
    // }
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false
    },
    toolbarOptions: {
      type: Object, // a JSON object of AAToolbarOptions object --> see aatoolbar.js
      required: true
    },
    searchTooltip: {
      type: String,
      required: false,
      default: aatoolbar.messages.searchTooltip
    }
  },
  setup () {
    return {
      // search: ref('')
    }
  },
  methods: {
    handleStateChanged (event) {
      Logger.log('AAToolbar.handleStateChanged')
      Logger.log(event)

      const obj = new AAToolbarOptions()
      obj.search = this.search
      try {
        if (this.$refs.dropdowns) {
          this.$refs.dropdowns.forEach((c) => {
            obj.dropdownOptions.push(c.getCurrentState())
          })
        }
      } catch (err) {
        // exception will be thrown when there are no dropdowns
        Logger.log(err)
      }

      Logger.log('emitting')
      Logger.log(obj)
      this.$emit('stateChanged', obj.toJson())
    }
  },
  data () {
    return {
      // searchTooltip: aatoolbar.messages.searchTooltip
      search: ref(this.toolbarOptions.search)
    }
  }
}
</script>
