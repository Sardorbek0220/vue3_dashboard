<script setup>
import axios from 'axios';
import { ref } from 'vue';
import apexchart from 'vue3-apexcharts';
// import AnalyticsTotalRevenue from '@/views/dashboard/AnalyticsTotalRevenue.vue'
</script>

<template>
  <VCard>
    <VRow class="mt-6">
      <VCol cols="9"></VCol>
      <VCol cols="2">
        <VueDatePicker v-model="date" :enable-time-picker="false" />
      </VCol>
      <VCol cols="1">
        <VBtn color="secondary" @click="get">
          Filter
        </VBtn>
      </VCol>
    </VRow>
    
    <VRow>
      <VCol
        cols="6"
      >
        <VCardItem class="pb-2 ml-6 mb-6">
          <VCardTitle>Categories pie</VCardTitle>
        </VCardItem>
        <apexchart class="ml-6" type="pie" width="100%" :options="pie.chartOptions" :series="pie.series"></apexchart>
      </VCol>
    </VRow>
  </VCard>
  
  <!-- <VRow>
    <VCol
      cols="12"
      md="8"
      order="2"
      order-md="1"
    >
      <AnalyticsTotalRevenue />
    </VCol>
  </VRow> -->
</template>

<script>
export default {
  data() {
    return {
      date: ref(new Date()),
      user: {},
      bar: {
        series: [{
          name: "sales",
          data: [
            {
              x: '2019/01/01',
              y: 400
            }, 
            {
              x: '2019/04/01',
              y: 430
            }, 
            {
              x: '2019/07/01',
              y: 448
            }, 
            {
              x: '2019/10/01',
              y: 470
            }, 
            {
              x: '2020/01/01',
              y: 540
            }, 
            {
              x: '2020/04/01',
              y: 580
            }, 
            {
              x: '2020/07/01',
              y: 690
            }, 
            {
              x: '2020/10/01',
              y: 690
            }
          ]
        }],
        chartOptions: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '30%',
              endingShape: 'rounded',
              startingShape: 'rounded',
            },
          },
          stroke: {
            width: 1,
            lineCap: 'round',
            colors: ['#00CCFF'],
          },
          colors: ['#00CCFF'],
          chart: {
            type: 'bar',
            height: 380,
          },
          xaxis: {
            type: 'category',
            labels: {
              style: {
                fontSize: '14px',
                fontFamily: 'Public Sans',
                colors: '#8592A3'
              },
              formatter: function(val) {
                return val
              }
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '14px',
                fontFamily: 'Public Sans',
                colors: '#8592A3'
              },
            },
          },
          title: {
            text: '',
          },
          tooltip: {
            x: {
              formatter: function(val) {
                return val
              }  
            }
          },
        },
      },
      pie: {
        series: [],
        chartOptions: {
          chart: {
            width: 380,
            type: 'pie',
          },
          labels: [],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom',
              }
            }
          }]
        },
      },
      info: [],
    }
  },

  created(){
    if (localStorage.getItem("manager_user")) {
      this.user = JSON.parse(localStorage.getItem("manager_user"));
      this.get();
    }else{
      this.$router.push({ name: 'Login' });
    }
    
  },

  methods: {
    async get(){
      if (!this.date) {
        alert("Date can't be blank !")
        return false;
      }
      this.info = [];
      const date = this.date.toISOString().slice(0, 10);

      var token = "";
      await axios.post("https://sdmanager.salesdoc.uz/api/v2/domain/jwt/token", 
        { user_id: this.user.user_id },
        { headers: { Authorization: 'Bearer ' + this.user.token } }
      ).then(response => {
        token = response.data.success.token
      }).catch(function(error){
        console.log(error);
      });

      if (token != "") {
        let domains = JSON.parse(localStorage.getItem("manager_domains"));

        const promises = domains.map(domain => axios.get(
          'https://'+domain.domain+'.salesdoc.io/api3/manager/index?id=1&jsonrpc=2.0&method=dataCS&params[date]='+date,
          { headers: { Authorization: 'Bearer ' + token }}
        ));
        const responses = await Promise.all(promises);

        for (const res of responses) {
          this.info.push(res.data.result)
          this.setPie(res.data.result.sale, res.data.result.host)
        }
      }

    },
    setPie(data, domain){
      var domain = domain
      for (const id in data) {
        var cat_sum = 0;
        var cat_name = "";
        for (const currency_id in data[id]) {
          cat_name = data[id][currency_id].name
          cat_sum += data[id][currency_id].sum
        }
        if (cat_sum == 0) {
          continue;
        }
        this.pie.series.push(cat_sum)
        this.pie.chartOptions.labels.push(cat_name+" ("+domain+")")
      }
    }
  }
}

</script>
<style>
.apexcharts-legend-text {
  color: rgb(133, 146, 163) !important;
}
</style>
