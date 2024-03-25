<script setup>
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
</script>

<template>
  <VerticalNavLayout>
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <VSpacer />

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: 'Дашборд',
          icon: 'bx-home',
          to: '/dashboard',
        }"
      />

      <VerticalNavLink
        :item="{
          title: 'Домены',
          icon: 'bx-server',
          to: '/domains',
        }"
      />

      <li class="nav-link">
        <VMenu>
          <template v-slot:activator="{ props }">
            <a color="primary" v-bind="props">
              <VIcon
                icon="bx-bar-chart"
                class="nav-item-icon"
              />
              Отчеты 
              <VIcon
                v-if="props['aria-expanded'] == 'false'"
                icon="bx-chevron-left"
                style="margin-left: 40%;"
              />
              <VIcon
                v-else
                icon="bx-chevron-down"
                style="margin-left: 40%;"
              />
            </a>
          </template>
          <VList>
            <VListItem>
              <VListItemTitle>
                <RouterLink to="/report/sale">Отчет по продажам</RouterLink>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </li>
      <!-- <VerticalNavLink
        :item="{
          title: 'Form Layouts',
          icon: 'mdi-form-select',
          to: '/form-layouts',
        }"
      /> -->
      <!-- <VerticalNavLink
        :item="{
          title: 'Login',
          icon: 'bx-log-in',
          to: '/login',
        }"
      /> -->
    </template>

    <slot />

    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
