<template>
  <q-btn-dropdown
    :label="label"
    class="col-1 q-pa-xs q-ml-lg toolbar-btn-dropdown"
    rounded
    outline
  >
    <!-- color="grey"
    text-color="red"
    content-style="color: #ff0000" -->

      <!-- rounded
    outline
    dense
    padding -->

    <q-card class="toolbar-btn-dropdown-menu">
      <q-card-section>
        <AABtnDropdownBtnGroup
          @check-all="handleCheckAll"
          @toggle-all="handleToggleAll"
          @clear-all="handleClearAll"
          class="toolbar-btn-dropdown-menu-btngrp"
        ></AABtnDropdownBtnGroup>
      </q-card-section>
      <q-card-section class="toolbar-btn-dropdown-menu-options">
        <q-option-group
          type="toggle"
          color="warning"
          v-model="groupModel"
          :options="options"
          @update:model-value="handleGroupStateChanged"
        ></q-option-group>
      </q-card-section>
    </q-card>
  </q-btn-dropdown>
</template>

<style lang="sass" scoped>
.toolbar-btn-dropdown-menu
  background: lighten($top-table-head-foot-background,5%)
  color: $main-toolbar-text-icon

.q-option-group
  color: $main-toolbar-text-icon
</style>

<script>
import { ref } from 'Vue'
import AABtnDropdownBtnGroup from 'components/AAToolbarBtnDropdownBtnGroup.vue'
import { AABtnDropdownOptions } from 'assets/js/aatoolbar.js'
import { Logger } from 'assets/js/logger.js'

export default {
  // name: 'AABtnDropdown',
  components: {
    AABtnDropdownBtnGroup
  },
  emits: ['stateChanged'],
  props: {
    label: {
      type: String,
      required: true
    },
    // an array of AABtnDropdownOptionsListItem objects --> see aatoolbar.js
    options: {
      type: Array,
      required: true
    }
  },
  setup () {
    return {
      groupModel: ref([])
    }
  },
  beforeUpdate () {
    // setup the default values for our options once component is ready
    this.options.forEach((e) => {
      if (e.selected) {
        this.groupModel.push(e.value)
      }
    })
  },
  methods: {
    handleCheckAll () {
      Logger.log('AAToolbarBtnDropdown.handleCheckAll')
      this.groupModel = this.options.map((e) => e.value)
      Logger.log(this.groupModel)
      this.handleGroupStateChanged()
    },
    handleToggleAll () {
      Logger.log('AAToolbarBtnDropdown.handleToggleAll')
      this.groupModel = this.options
        .map((e) => e.value)
        .filter((e) => !this.groupModel.includes(e))
      Logger.log(this.groupModel)
      this.handleGroupStateChanged()
    },
    handleClearAll () {
      Logger.log('AAToolbarBtnDropdown.handleClearAll')
      this.groupModel = []
      Logger.log(this.groupModel)
      this.handleGroupStateChanged()
    },
    handleGroupStateChanged () {
      // build options
      this.$emit('stateChanged', this.getCurrentState())
    },
    getCurrentState () {
      const state = new AABtnDropdownOptions(this.label)
      this.options.forEach((e) => {
        state.addOption(e.label, this.groupModel.includes(e.label))
      })
      return state
    }
  }
}
</script>
