<template>
  <q-page class="bg-black text-white text-center q-pa-md flex flex-center" style="overflow: hidden; user-select: none;">

    <div class="aa-title">
      <!-- <div>Alt Army</div>
      <div class="author">by noobythemidget</div> -->

      <!-- <div>Alt Army</div>
      <div class="icon">&#xe900;</div> -->

      <!-- <span>Alt</span> <span class="icon" style="position: relative; top: 25px;">&#xe900;</span> <span>Army</span> -->

      <span>Alt Army</span>

      <!-- <span style="font-size: 75px">Alt Army</span> -->

      <!-- <div class="icon" style="font-size: 700px">&#xe900;</div> -->
    </div>

    <div class="overlay-box aa-title">
      <span class="icon" style="position: relative; top: 125px;">&#xe900;</span>
    </div>

    <div class="overlay-box">
      <h4>
        <!-- font-size: 55px -->
        <!-- <one-ring class="ring-slow3" style="font-size: 70px"></one-ring> -->
      </h4>
      <div class="icon ring-slow3" style="font-size: 1500px;">&#xe902;</div>
    </div>
  </q-page>

</template>

<style lang="sass" scoped>
.aa-title
  font-family: ringbearer
  font-size: 75px
  color: $heat-yellow
  z-index: 1
  animation: glow4 20s ease-in-out 5s 1 both

.author
  font-size: 20px
  opacity: .8

.overlay-box
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  // color: white
  background: transparent //#666666
  opacity: .8
  z-index: 1000

.icon
  font-family: alt-army
  font-size: 150px
  // transform: translateY(100)
</style>

<script>
import { defineComponent } from 'vue'
// import OneRing from 'components/OneRing.vue'

export default defineComponent({
  name: 'PageIndex',

  components: {
    // OneRing
  }
})

</script>
