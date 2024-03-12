<script setup>
import axios from 'axios';
import apexchart from 'vue3-apexcharts';
// import AnalyticsTotalRevenue from '@/views/dashboard/AnalyticsTotalRevenue.vue'
</script>

<template>
  <VCard>
    <VRow>
      <VCol
        cols="12"
        md="12"
      >
        <VCardItem class="pb-0">
          <VCardTitle>Categories bars</VCardTitle>
        </VCardItem>
        <apexchart type="bar" height="380" :options="bar.chartOptions" :series="bar.series"></apexchart>
      </VCol>
      <VCol
        cols="6"
      >
        <VCardItem class="pb-2 ml-6">
          <VCardTitle>Categories pie</VCardTitle>
        </VCardItem>
        <apexchart class="ml-6" type="pie" width="380" :options="pie.chartOptions" :series="pie.series"></apexchart>
      </VCol>
      <VCol
        cols="6"
      >
        <VCardItem class="pb-2 ml-6">
          <VCardTitle>Categories pie</VCardTitle>
        </VCardItem>
        <apexchart class="ml-6" type="pie" width="380" :options="pie.chartOptions" :series="pie.series"></apexchart>
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
        series: [44, 55, 13, 43, 22],
        chartOptions: {
          chart: {
            width: 380,
            type: 'pie',
          },
          labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
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
        await axios.get('https://demosd.salesdoc.io/api3/manager/index?id=1&jsonrpc=2.0&method=sales&params[datestart]=2024-03-01&params[endstart]=2024-03-31',
          { headers: { Authorization: 'Bearer ' + token }}
        ).then(response => (
          this.info = response
        )).catch(function(error){
          console.log(error);
        });
        console.log(this.info);
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
