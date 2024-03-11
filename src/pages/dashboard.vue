<script setup>
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
      }
    }
  },

  created(){
    
  },

  methods: {

  }
}

</script>
<style>
.apexcharts-legend-text {
  color: rgb(133, 146, 163) !important;
}
</style>
