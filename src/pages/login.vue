<script setup>
import logo from '@images/logo.png';
import axios from 'axios';
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      width="600px"
      v-if="sendingPhone"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <VImg class="d-flex text-primary" :src="logo" />
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold">
          SD manager
        </VCardTitle>
      </VCardItem>

      <VCardText />

      <VCardText>
        <VForm>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="userPhone"
                autofocus
                placeholder="998941234567"
                label="Номер телефона"
                prepend-inner-icon="bx-mobile"
                type="number"
              />
            </VCol>

            <VCol cols="12">
              <VBtn
                block
                type="button"
                @click="login" :loading="loading"
              >
              Получение кода
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
    <VCard
      class="auth-card pa-4 pt-7"
      width="600px"
      v-else
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <VImg class="d-flex text-primary" :src="logo" />
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold">
          SD manager
        </VCardTitle>
      </VCardItem>

      <VCardText />

      <VCardText>
        <VForm>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="userCode"
                autofocus
                placeholder=""
                label="Напишите 4 цифры"
                type="number"
              />
            </VCol>

            <VCol cols="12">
              <VBtn
                block
                type="button"
                @click="sendCode" :loading="loading"
              >
              Отправка кода
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
    <VSnackbar
      v-model="showResult"
      :timeout="2000"
      >
      {{ result }}
    </VSnackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sendingPhone: true,
      sms_token: 'a12T05RpG3yLbzasaX3UJVAnLmt34',
      type: 'sd_manager',
      info: [],
      loading: false,
      userPhone: '',
      userCode: '',
      error: false,
      showResult: false,
      result: ''
    }
  },

  methods: {
    async login(){

      if (!this.userPhone) {
        this.result = "Phone can't be null.";
        this.showResult = true;
        return;
      }

      this.loading = true;

      let form = {
        phone: this.userPhone,
        type: this.type,
        token: this.sms_token
      }

      await axios.post('https://sdmanager.salesdoc.uz/api/v2/sms/send', form).then(response => (
        this.info = response
      ));

      this.loading = false
      if (this.info.data.success === true) {
        this.sendingPhone = false
      }
      else {
        this.error = true;
        this.result = "Phone is incorrect.";
        this.showResult = true;
      }
    },
    async sendCode(){

      if (!this.userCode) {
        this.result = "Code can't be null.";
        this.showResult = true;
        return;
      }

      this.loading = true;

      let form = {
        phone: this.userPhone,
        code: this.userCode,
        type: this.type,
        token: this.sms_token
      }

      await axios.post('https://sdmanager.salesdoc.uz/api/v2/user/checkCode', form).then(response => (
        this.info = response
      ));

      this.loading = false
      if (this.info.data.success === true) {
        localStorage.setItem("manager_user", JSON.stringify(this.info.data.result));
        this.$router.push({ path: '/dashboard' })
      }
      else {
        this.error = true;
        this.result = "Code is incorrect.";
        this.showResult = true;
      }
    }
  }
}
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
