<script setup>
import axios from 'axios';
</script>
<template>
  <VBtn @click="openDialog" class="mb-6">
    Добавить домен
  </VBtn>
  <VTable>
    <thead>
      <tr>
        <th class="text-uppercase">
          Название
        </th>
        <th>
          Url
        </th>
        <th>
          Удалить
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in data"
        :key="item.domain"
      >
        <td>
          {{ item.domain }}
        </td>
        <td class="text-center">
          {{ item.url }}
        </td>
        <td class="text-center">
          <VIcon size="24" icon="bx-block" @click="deleteDomain(item.domain)"/>
        </td>
      </tr>
    </tbody>
  </VTable>
  <VDialog
    v-model="dialog"
    width="500">
    <VCard>
      <VCardTitle class="headline"
        primary-title>
        Добавить домен
      </VCardTitle>

      <VCardText>
        <VForm>
          <VContainer>
            <VLayout row wrap>
              <VTextField
                v-model="domain"
                label="Домен"/>
            </VLayout>
          </VContainer>
        </VForm>
      </VCardText>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn
          flat
          color="secondary"
          @click="dialog = false">
          Отмена
        </VBtn>
        <VBtn
          color="success"
          :loading="loading"
          @click="addDomain">
          Добавить
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      user: {},
      domain: '',
      dialog: false,
      data: []
    }
  },
  created(){
    if (localStorage.getItem("manager_user")) {
      this.user = JSON.parse(localStorage.getItem("manager_user"));
      this.getDomains(this.user);
    }else{
      this.$router.push({ name: 'Login' });
    }
  },
  methods: {
    openDialog() {
      this.dialog = true;
      this.domain = ''
    },
    addDomain(){
      if (this.domain == '') {
        alert("Domain can not be empty !")
        return;
      }
      
      let data = this.data.filter( d => d.domain == this.domain );
      if (data.length > 0) {
        alert("Domain is already exist !")
        return;
      }

      axios.post("https://sdmanager.salesdoc.uz/api/v2/domain/add", 
        { domain: this.domain, user_id: this.user.user_id },
        { headers: { Authorization: `Bearer ${this.user.token}` } }
      ).then(response => {
        if (response.data.success === true) {
          this.dialog = false;
          this.data.push({domain: this.domain, url: "https://"+this.domain+".salesdoc.io"})
          localStorage.removeItem("manager_domains");
          localStorage.setItem("manager_domains", JSON.stringify(this.data));
        }else{
          alert("Something went wrong !");
        }        
      }).catch(function(error)
      {
        if (error.response.status == 401) {
          localStorage.removeItem("manager_user");
          location.reload();
        }
      });
    },
    deleteDomain(domain){
      if(confirm("Вы уверены !")){
        axios.delete("https://sdmanager.salesdoc.uz/api/v2/domain/delete?user_id="+this.user.user_id+"&domain="+domain, 
          { headers: { Authorization: `Bearer ${this.user.token}` } }
        ).then(response => {
          if (response.data.success === true) {
            this.dialog = false;
            this.data = this.data.filter( d => d.domain !== domain ); 
            localStorage.removeItem("manager_domains");
            localStorage.setItem("manager_domains", JSON.stringify(this.data));
          }else{
            alert("Something went wrong !");
          }        
        }).catch(function(error)
        {
          if (error.response.status == 401) {
            localStorage.removeItem("manager_user");
            location.reload();
          }
        });
      }
    },
    getDomains(user){
      axios.get("https://sdmanager.salesdoc.uz/api/v2/domain/list?user_id="+user.user_id, 
        { headers: { Authorization: `Bearer ${user.token}` } }).then(response => {
          if (response.data.success === true) {
            this.data = response.data.result;
            localStorage.setItem("manager_domains", JSON.stringify(this.data));
          }else{
            alert("Something went wrong !");
          }        
      }).catch(function(error)
      {
        if (error.response.status == 401) {
          localStorage.removeItem("manager_user");
          location.reload();
        }
      });
    }
  }
}
</script>
