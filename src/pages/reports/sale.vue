<script setup>
import axios from 'axios';
import apexchart from 'vue3-apexcharts';
</script>

<template>
    <VRow>
        <VCol cols="3">
            <VueDatePicker class="mt-4" v-model="fields.date" range :partial-range="false" cancelText="cancel" selectText="ok" />
        </VCol>
        <VCol cols="2">
            <VSelect 
                v-model="fields.dateType"
                :items="dateTypes"                
            />
        </VCol>
        <VCol cols="2">
            <VSelect 
                multiple
                v-model="fields.orderType"
                :items="orderTypes"                
            />
        </VCol>
        <VCol cols="2">
            <VSelect 
                v-model="fields.type"
                :items="types"                
            />
        </VCol>
        <VCol cols="2">
            <VSelect 
                v-model="fields.label"
                :items="labelTypes"                
            />
        </VCol>
        <VCol cols="1">
            <VBtn class="mt-4" width="100%" color="secondary" @click="get">
                Filter
            </VBtn>
        </VCol>
    </VRow>
  
    <VRow>
        <VCol
            cols="12"
        >
            <VCard height="500px">
                <apexchart type="bar" width="100%" height="100%" :options="bar.chartOptions" :series="bar.series"></apexchart>
            </VCard>
        </VCol>
        <VCol
            cols="12"
            class="pb-2 mb-4"
        >
            <EasyDataTable
                :headers="categoryHeader"
                :items="categoryData"
                table-class-name="customize-table"
            >
                <template #item-sum="{ sum }">
                    {{ sum.toLocaleString() }}
                </template>
            </EasyDataTable>  
        </VCol>
        <VCol
            cols="12"
            v-if="fields.type != 3"
        >
            <VCard height="500px">
                <apexchart type="line" width="100%" height="100%" :options="line.chartOptions" :series="line.series"></apexchart>
            </VCard>
        </VCol>
    </VRow>
</template>

<script>
export default {
    data() {
        return {
            dateTypes: [
                {title: 'Дата заявки', value:"order.DATE"},
                {title: 'Дата отгрузки', value:"order.DATE_LOAD"},
                {title: 'Дата доставки', value: "order.DATE_DELIVERED"},
            ],
            orderTypes: [
                {title: 'Новый', value: 1},
                {title: 'Отгружен', value: 2},
                {title: 'Доставлен', value: 3},
                {title: 'Возврат', value: 4},
                {title: 'Отменён', value: 5}
            ],
            types: [
                {
                    title: 'Количество',
                    value: 0
                },
                {
                    title: 'Объем',
                    value: 1
                },
                {
                    title: 'Сумма',
                    value: 2
                },
                {
                    title: 'АКБ',
                    value: 3
                },
                {
                    title: 'Блок',
                    value: 4
                }
            ],
            labelTypes: [
                {
                    title: 'По дилерам',
                    value: 0
                },
                {
                    title: 'По региону',
                    value: 1
                },
                {
                    title: 'По территории',
                    value: 2
                },
                {
                    title: 'По группировке дилеров',
                    value: 3
                }
            ],
            fields: {
                orderType: [2,3],
                dateType: "order.DATE_LOAD",
                type: 2,
                label: 0,
                date: [(new Date()).toISOString().slice(0, 8) + '01' ,(new Date()).toISOString().slice(0, 10)],
            },
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
            user: {},
            bar: {
                series: [{
                    name: "Продажа",
                    data: []
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
                        height: 180,
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
                        theme: "dark",
                        y: {
                            formatter: function(val) {
                                return val.toLocaleString();
                            }  
                        }
                    },
                    dataLabels: {
                        formatter: function(val) {
                            return val.toLocaleString();
                        },
                    },
                },
            },
            line: {
                series: [{
                    name: "Продажа",
                    data: []
                }],
                chartOptions: {
                    chart: {
                        height: 350,
                        type: 'line',
                        zoom: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function(val) {
                            return val.toLocaleString();
                        },
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    colors: ['#00CCFF'],
                    title: {
                        text: '',
                        align: 'left'
                    },
                    grid: {
                        row: {
                            colors: ['white', 'transparent'],
                            opacity: 0.5
                        },
                    },
                    xaxis: {
                        categories: [],
                        labels: {
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Public Sans',
                                colors: '#8592A3'
                            },
                            formatter: function(val) {
                                return val;
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
                    tooltip: {
                        theme: "dark",
                        y: {
                            formatter: function(val) {
                                return val.toLocaleString();
                            }  
                        }
                    },
                },
            },
            areas: {}
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
            if (!this.fields.date) {
                alert("Date can't be blank !")
                return false;
            }
            this.setDays(this.fields.date[0], this.fields.date[1]);

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

                const promises = domains.map(domain => axios.post(
                'https://'+domain.domain+'.salesdoc.io/api3/manager/index',
                    { id: "1", jsonrpc: "2.0", method: "saleReportCS", params: this.fields },
                    { headers: { Authorization: 'Bearer ' + token }}
                ));
                const responses = await Promise.all(promises);

                this.bar.series[0].data.splice(0)
                this.line.series[0].data.splice(0)

                var lineData = {}
                for (const res of responses) {
                    var chartData = {
                        host: res.data.host,
                        data: {}
                    }

                    res.data.areas.forEach(area => {
                        if (!this.areas[res.data.host]) {
                        this.areas[res.data.host] = {}
                        }
                        this.areas[res.data.host][area.value] = area.text
                    });
                    
                    for (const data of res.data.data) {
                        
                        for (const dealer in data) {
                            
                            if (dealer == 'category_id') {
                                continue;
                            }
                            if (!chartData.data[dealer]) {
                                chartData.data[dealer] = 0;
                            }
                            
                            if (data[dealer] != []) {
                                for (const day in data[dealer]) {
                                    chartData.data[dealer] += data[dealer][day];
                                    if (!lineData[day]) {
                                        lineData[day] = 0;
                                    }
                                    lineData[day] += data[dealer][day];
                                }
                            }                            
                        }
                    }

                    this.setData(chartData)
                }

                this.line.chartOptions.xaxis.categories.forEach(day => {
                    if (lineData[day]) {
                        this.line.series[0].data.push(lineData[day])
                    }else{
                        this.line.series[0].data.push(0)
                    }
                });
            }

        },

        setData(data){
            for (const area_id in data.data) {
                if (data.data[area_id] == 0) {
                    continue;
                }
                this.bar.series[0].data.push({x: this.areas[data.host][area_id]+" ("+data.host+")", y: data.data[area_id]})
            }
        },

        setDays(start, end) {
            this.line.chartOptions.xaxis.categories.splice(0)
            for(var dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
                this.line.chartOptions.xaxis.categories.push(new Date(dt).toISOString().slice(5, 10))
            }
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
