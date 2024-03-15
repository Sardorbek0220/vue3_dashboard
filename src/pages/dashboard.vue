<script setup>
import cardSuccess from '@images/cards/credit-card-success.png';
import walletPrimary from '@images/cards/wallet-primary.png';
import axios from 'axios';
import { ref } from 'vue';
import apexchart from 'vue3-apexcharts';
</script>

<template>
  <VRow>
    <VCol cols="9"></VCol>
    <VCol cols="2">
      <VueDatePicker v-model="date" :enable-time-picker="false" />
    </VCol>
    <VCol cols="1">
      <VBtn width="100%" color="secondary" @click="get">
        Filter
      </VBtn>
    </VCol>
  </VRow>
  
  <VRow>
    <VCol
      cols="4"
    >
      <VCard>
        <VCardItem class="pb-2 ml-1 mb-2">
          <VCardTitle align="center">Общая сумма заявок на</VCardTitle>
        </VCardItem>
        <VCardText>
          <VList class="card-list">
            <VListItem>
              <template #prepend>
                <VAvatar
                  rounded
                  variant="tonal"
                  color="primary"
                  :image="cardSuccess"
                  class="me-6"
                />
              </template>

              <VListItemTitle>
                Итого
              </VListItemTitle>

              <template #append>
                <VListItemAction>
                  <span class="me-6" style="font-size: x-large;">{{ summary.all.toLocaleString() }}</span>
                </VListItemAction>
              </template>
            </VListItem>
            <hr class="mb-2">
            <VListItem
              v-for="(value, key) in summary.data"
              :key="key"
            >
              <template #prepend>
                <VAvatar
                  rounded
                  variant="tonal"
                  color="primary"
                  :image="walletPrimary"
                  class="me-6"
                />
              </template>

              <VListItemTitle>
                {{ key }}
              </VListItemTitle>

              <template #append>
                <VListItemAction>
                  <span class="me-6" style="font-size: large;">{{ value.toLocaleString() }}</span>
                  <span class="text-disabled"></span>
                </VListItemAction>
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="4"
    >
      <VRow>
        <VCol cols="6">
          <VCard class="pb-1" color="info">
            <VCardItem>
              <VCardTitle align="center" style="color: white;">{{ visit.planned }}</VCardTitle>
            </VCardItem>
            <VCardText align="center">
              Плановые посещения
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="6">
          <VCard class="pb-1" color="success">
            <VCardItem>
              <VCardTitle align="center" style="color: white;">{{ visit.akb }}</VCardTitle>
            </VCardItem>
            <VCardText align="center">
              АКБ
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="6">
          <VCard class="pb-1" color="warning">
            <VCardItem>
              <VCardTitle align="center" style="color: white;">{{ visit.reject }}</VCardTitle>
            </VCardItem>
            <VCardText align="center">
              Отказы
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="6">
          <VCard class="pb-1" color="error">
            <VCardItem>
              <VCardTitle align="center" style="color: white;">{{ visit.not_visited }}</VCardTitle>
            </VCardItem>
            <VCardText align="center">
              Непосещеннные
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
    <VCol
      cols="4"
    >
      <VRow>
        <VCol cols="6">
          <VCard>
            <VCardText style="padding: 5% !important;">
                <div>
                    Посещения (по визитам)
                </div>
            </VCardText>
            <VCardText style="padding-left: 5% !important;">
              <div class="pb-4">
                {{ mainVisitData.plan ? ((mainVisitData.plan_visit / mainVisitData.plan) * 100).toFixed(2) : 0 }} %
              </div>
              <VRow style="padding-bottom: 0% !important;">
                <VCol>
                    План: {{ mainVisitData.plan }}
                </VCol>
                <VCol>
                    Факт: {{ mainVisitData.plan_visit }} + {{ mainVisitData.no_plan_visit }}
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="6">
          <VCard>
            <VCardText style="padding: 5% !important;">
              <div>
                Успешные визиты
              </div>
            </VCardText>
            <VCardText style="padding-left: 5% !important;">
              <div class="pb-4">
                {{ mainVisitData.plan_visit ? ((mainVisitData.plan_order / mainVisitData.plan_visit) * 100).toFixed(2) : 0 }} %
              </div>
              <VRow style="padding: 0% !important;">
                <VCol>
                  Визиты: {{ mainVisitData.plan_visit }} + {{ mainVisitData.no_plan_visit }}
                </VCol>
                <VCol>
                  Заказ: {{ mainVisitData.plan_order }} + {{ mainVisitData.no_plan_order }}
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="6" class="pb-1">
          <VCard>
            <VCardText style="padding: 5% !important;">
              <div>
                Посещения (по GPS )
              </div>
            </VCardText>
            <VCardText style="padding-left: 5% !important;">
              <div class="pb-4">
                {{ mainVisitData.plan_visit ? ((mainVisitData.plan_gps / mainVisitData.plan_visit) * 100).toFixed(2) : 0 }} %
              </div>
              <VRow style="padding: 0% !important;">
                <VCol>
                  Визиты: {{ mainVisitData.plan_visit }} + {{ mainVisitData.no_plan_visit }}
                </VCol>
                <VCol>
                  Факт: {{ mainVisitData.plan_gps }} + {{ mainVisitData.no_plan_gps }}
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="6">
          <VCard>
            <VCardText style="padding: 5% !important;">
              <div>
                Фото отчеты
              </div>
            </VCardText>
            <VCardText style="padding-left: 5% !important;">
              <div class="pb-4">
                {{ mainVisitData.plan_visit ? ((mainVisitData.plan_photo / mainVisitData.plan_visit) * 100).toFixed(2) : 0 }} %
              </div>
              <VRow style="padding: 0% !important;">
                <VCol>
                  Визиты: {{ mainVisitData.plan_visit }} + {{ mainVisitData.no_plan_visit }}
                </VCol>
                <VCol>
                  Факт: {{ mainVisitData.plan_photo }} + {{ mainVisitData.no_plan_photo }}
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
    <VCol
      cols="6"
    >
      <VCard class="pb-2 mb-4">
        <VCardItem>
          <VCardTitle align="center">Доля по категории продуктов</VCardTitle>
        </VCardItem>
        <apexchart class="ml-1" type="pie" width="100%" :options="pie.chartOptions" :series="pie.series"></apexchart>
      </VCard>
    </VCol>
    <VCol
      cols="6"
      class="pb-2 mb-4"
    >
      <EasyDataTable
        :headers="categoryHeader"
        :items="categoryData"
        table-class-name="customize-table"
      /> 
    </VCol>
    <VCol
      cols="12"
      class="pb-2 mb-4"
    >
      <EasyDataTable
        :headers="dealerHeader"
        :items="dealerData"
        table-class-name="customize-table"
      /> 
    </VCol>
  </VRow>
</template>

<script>
export default {
  data() {
    return {
      dealerData: [],
      dealerHeader: [
        {
          text: 'Дилер',
          value: 'name'
        },
        {
          text: 'Сумма',
          value: 'sum',
          align: 'end'
        },
        {
          text: 'Объём',
          value: 'volume',
          align: 'end'
        },
        {
          text: 'Кол-во',
          value: 'count',
          align: 'end'
        },
        {
          text: 'Плановые посещения',
          value: 'planned',
          align: 'end'
        },
        {
          text: 'Посещенные',
          value: 'visited',
          align: 'end'
        },
        {
          text: 'АКБ',
          value: 'akb',
          align: 'end'
        },
        {
          text: 'Отказы',
          value: 'reject',
          align: 'end'
        },
        {
          text: 'Непосещенные',
          value: 'not_visited',
          align: 'end'
        },
        {
          text: 'Фотоотчёты',
          value: 'photo',
          align: 'end'
        },
        {
          text: 'Успешный посещения',
          value: 'plan',
          align: 'end'
        },
        {
          text: 'План',
          value: 'moPlan',
          align: 'end'
        },
        {
          text: 'Факт',
          value: 'fact',
          align: 'end'
        },
        {
          text: 'Индекс',
          value: 'index',
          align: 'end'
        }
      ],
      categoryData: [],
      categoryHeader: [
        {
          text: 'Категория',
          value: 'category',
          sortable: true
        },
        {
          text: 'Доля',
          value: 'part',
          sortable: true
        },
        {
          text: 'Сумма',
          value: 'sum',
          sortable: true
        },
        {
          text: 'Объем',
          value: 'volume',
          sortable: true
        },
        {
          text: 'Количество',
          value: 'count',
          sortable: true
        },
        {
          text: 'АКБ',
          value: 'akb',
          sortable: true
        }
      ],
      summary: {
        all: 0,
        data: {}
      },
      mainVisitData: {
        plan: 0,
        plan_visit: 0,
        no_plan_visit: 0,
        plan_order: 0,
        no_plan_order: 0,
        plan_photo: 0,
        no_plan_photo: 0,
        plan_gps: 0,
        no_plan_gps: 0
      },
      visit: {
        planned: 0,
        akb: 0,
        reject: 0,
        not_visited: 0
      },
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

        this.pie.series.splice(0)
        this.pie.chartOptions.labels.splice(0)

        this.summary.all = 0
        this.summary.data = {}

        this.visit.planned = 0
        this.visit.akb = 0
        this.visit.reject = 0
        this.visit.not_visited = 0

        this.mainVisitData.plan = 0
        this.mainVisitData.plan_visit = 0
        this.mainVisitData.no_plan_visit = 0
        this.mainVisitData.plan_order = 0
        this.mainVisitData.no_plan_order = 0
        this.mainVisitData.plan_photo = 0
        this.mainVisitData.no_plan_photo = 0
        this.mainVisitData.plan_gps = 0
        this.mainVisitData.no_plan_gps = 0

        for (const res of responses) {
          var data = res.data.result

          this.setData(data.sale, data.host)
          if (data.visit) {
            for (const id in data.visit) {
              this.visit.planned += data.visit[id].planned
              this.visit.akb += data.visit[id].akb
              this.visit.reject += data.visit[id].reject
              this.visit.not_visited += data.visit[id].not_visited

              this.mainVisitData.plan += data.visit[id].planned
              this.mainVisitData.plan_visit += data.visit[id].plan_visit
              this.mainVisitData.no_plan_visit += data.visit[id].visited - data.visit[id].plan_visit
              this.mainVisitData.plan_order += data.visit[id].plan_order
              this.mainVisitData.no_plan_order += data.visit[id].no_plan_order
              this.mainVisitData.plan_photo += data.visit[id].plan_photo
              this.mainVisitData.no_plan_photo += data.visit[id].no_plan_photo
              this.mainVisitData.plan_gps += data.visit[id].plan_gps
              this.mainVisitData.no_plan_gps += data.visit[id].no_plan_gps
            }
          }

        }
        let summary = this.summary;
        let categoryData = this.categoryData;

        this.categoryData = Object.values(categoryData).map(item => {
          item.part = this.getPercent(item.sum && (item.sum / summary.all))
          return item
        })
      }

    },
    setData(data, domain){
      var domain = domain
      for (const id in data) {
        var cat_sum = 0;
        var cat_name = "";
        for (const currency_id in data[id]) {
          cat_name = data[id][currency_id].name
          cat_sum += data[id][currency_id].sum

          this.summary.all += data[id][currency_id].sum
          if (!this.summary.data[domain+"-"+currency_id]) {
            this.summary.data[domain+"-"+currency_id] = data[id][currency_id].sum
          } else {
            this.summary.data[domain+"-"+currency_id] += data[id][currency_id].sum
          }

          if (this.categoryData[domain+"-"+id] === undefined) {
            this.categoryData[domain+"-"+id] = {
              category: cat_name,
              part: 0,
              sum: 0,
              volume: 0,
              count: 0,
              akb: 0,
            }
          }
          this.categoryData[domain+"-"+id].sum += data[id][currency_id].sum
          this.categoryData[domain+"-"+id].volume += data[id][currency_id].volume
          this.categoryData[domain+"-"+id].count += data[id][currency_id].count
          this.categoryData[domain+"-"+id].akb += data[id][currency_id].akb
        }
        if (cat_sum == 0) {
          continue;
        }
        this.pie.series.push(cat_sum)
        this.pie.chartOptions.labels.push(cat_name+" ("+domain+")")
      }
    },
    getPercent(number) {
      return (number && number.toLocaleString('en-EN', {
        style: 'percent',
        minimumFractionDigits: 2
      })) || 0
    },
  }
}

</script>
<style>
.apexcharts-legend-text {
  color: rgb(133, 146, 163) !important;
}

.v-card-text {
  font-size: 12px !important;
}

.customize-table {
  --easy-table-header-font-color: #fff;
  --easy-table-header-background-color: #8592a3;
}
</style>

<style lang="scss" scoped>
  .card-list {
    --v-card-list-gap: 1.6rem;
  }
</style>
