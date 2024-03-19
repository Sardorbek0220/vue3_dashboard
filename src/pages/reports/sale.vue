<script setup>
import axios from 'axios';
import apexchart from 'vue3-apexcharts';
</script>

<template>
    <VRow>
        <VCol cols="3">
            <VueDatePicker class="mt-4" v-model="date" range :partial-range="false" cancelText="cancel" selectText="ok" />
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
    </VRow>
</template>

<script>
export default {
    data() {
        return {
            country: null,
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
            date: [(new Date()).toISOString().slice(0, 8) + '01' ,(new Date()).toISOString().slice(0, 10)],     
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
                    x: {
                    formatter: function(val) {
                        return val
                    }  
                    }
                },
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
            console.log(this.date);
            if (!this.date) {
                alert("Date can't be blank !")
                return false;
            }
            const date = this.date;

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

            }

        },

        setData(data, domain){
        var domain = domain
        
        }
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
