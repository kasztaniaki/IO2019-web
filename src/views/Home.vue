<template>
  <div class="home">
    <div class="logo">
      <img alt="Vue logo" src="../assets/logo.png">
    <p>
      For a guide check out the
      <a href="https://tiny.cc/kas-dok-uzytkownika" target="_blank" rel="noopener">user documentation</a>.
    </p>
        </div>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home'
}
</script>

<style>
.logo {
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    max-width: 100%;
    max-height: 100%;

}

</style>
