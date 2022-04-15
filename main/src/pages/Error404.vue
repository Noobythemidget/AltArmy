<template>
  <div class="fullscreen bg-black text-white text-center q-pa-md flex flex-center">
    <div>

      <div style="font-size: 20vh; opacity: .4; z-index: 1; color: #F9A01B;">
        404
      </div>

      <div class="text-h2" style="opacity:.4; z-index: 1">
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="warning"
        text-color="black"
        label="Go Home"
        unelevated
        to="/"
        no-caps
      />

      <div class="overlay-box">
        <OneRing style="font-size: 80px; z-index: 2" class="ring-slow"></OneRing>
      </div>

    </div>
  </div>
</template>

<style>
.overlay-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  background: #666666;
  opacity: .8;
  z-index: 1000;
}

.ring-btn {
  font-family: theonering;
  font-size: 150px;
  color: orange;
  background: black;
}

.myanim {
  /* background: orange; */
  /* color: black; */
  animation: bgwave 5s ease-in-out 10s alternate;
}

@keyframes bgwave {
  0% {
    color: black;
  }
  100% {
    color: orange;
  }
}
</style>

<script>
import { defineComponent } from 'vue'
import OneRing from 'components/OneRing.vue'

export default defineComponent({
  name: 'Error404',
  components: {
    OneRing
  }
})
</script>
