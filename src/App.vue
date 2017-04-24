<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <footer class="footer">
      <router-link to="/">Home</router-link>
      <router-link to="/About">About</router-link>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.child-view {
  position: absolute;
  transition: all .5s cubic-bezier(.55, 0, .1, 1);
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}

.background {
  z-index: -1;
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  opacity: 0.1;
}

.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background-color: #efefef;
  text-align: center;
}

.footer a {
  text-decoration: none;
}

html {
  background-color: black;
  overflow: hidden;
}

.hello {
  color: white;
  height: 100%;
  width: 100%;
}

#app {
  font-family: "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity .3s ease;
}

.component-fade-enter,
.component-fade-leave-to
/* .component-fade-leave-active for <2.1.8 */

{
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
