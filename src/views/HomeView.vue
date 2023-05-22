<script setup>
import TheWelcome from "../components/TheWelcome.vue";
import router from "../router";
const routerList = router.getRoutes();
</script>

<template>
  <main>
    <ul>
      <li v-for="item in routerList">
        <router-link :to="item.path">{{ item.name }}</router-link>
      </li>
    </ul>
    <router-view />
  </main>
</template>
<style>
body {
  /* overflow: hidden; */
  margin: 0px;
  background-color: #fff;
}
ul {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin: 0 180px;
}
li {
  padding: 0 20px;
  display: block;
}
</style>
