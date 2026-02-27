<template>
  <div class="app-layout" v-if="authStore.isLoggedIn">
    <AppSidebar />
    <div class="app-main">
      <AppNavbar />
      <div class="app-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
  <router-view v-else />
</template>

<script setup>
import { useAuthStore } from "./stores/authStore";
import AppSidebar from "./components/AppSidebar.vue";
import AppNavbar from "./components/AppNavbar.vue";

const authStore = useAuthStore();
</script>

<style scoped></style>
