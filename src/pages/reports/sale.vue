<script setup>
import axios from 'axios';
import apexchart from 'vue3-apexcharts';
</script>

<template>
    <VRow>
        <VCol cols="3">
            <VueDatePicker class="mt-4" v-model="fields.date" range :partial-range="false" cancelText="Отмена" selectText="Сохранить" />
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
            <VBtn class="mt-4" width="100%" color="secondary" @click="get" :loading="loading">
                Фильтр
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
        >
        <VCard>
            <EasyDataTable
                :headers="categoryHeader"
                :items="categoryData"
                table-class-name="customize-table"
                @expand-row="loadIntroduction"
                :rows-per-page="10"
            >
                <template #item-sum="{ sum }">
                    {{ sum.toLocaleString() }}
                </template>
                <template #expand="item">
                    <EasyDataTable class="mt-2 mb-2"
                        :headers="productHeader"
                        :items="productData"
                        table-class-name="customize-table-inside"
                        :rows-per-page="10"
                    >
                    </EasyDataTable>
                </template>
            </EasyDataTable>  
            <VBtn @click="exportData(categoryData, categoryHeader, 'category')" class="mt-2 mb-2 mr-2" style="float: inline-end;">export</VBtn>
        </VCard>
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

var dataToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,',
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
    base64 = function(s) {
        return window.btoa(unescape(encodeURIComponent(s)))
    },
    format = function(s, c) {
        return s.replace(/{(\w+)}/g, function(m, p) {
            return c[p];
        })
    },
    create = e => document.createElement(e)
  return function(data, headers, name) {
    let table;
    if (Array.isArray(data)) {
        table = create('table')
        let thead
        if (!Array.isArray(headers)) {
            thead = headers.head
            headers = headers.headers
        } else {
            thead = create('thead')
            let row = create('tr')
            headers.forEach(item => {
                let th = create('th')
                th.innerText = item.text
                row.append(th)
            })
            thead.append(row)
        }
        table.append(thead)
        let tbody = create('tbody')
        data.forEach(item => {
            let row = create('tr')
            headers.forEach(header => {
                let td = create('td')
                td.innerHTML = item[header.value] === undefined ? '' : item[header.value]
                row.append(td)
            })
            tbody.append(row)
        })
        table.append(tbody)
    } else if (!data.nodeType) {
        table = document.querySelector(table)
    } else {
        table = data
    }
    var ctx = {
        worksheet: name || 'Worksheet',
        table: table.innerHTML
    }
    let downloadLink = document.createElement("a");
    downloadLink.href = uri + base64(format(template, ctx));
    var filename = new Date().toLocaleDateString("es-CL");
    downloadLink.download = name + ' (' + filename + ')';
    downloadLink.click();
  }
})();

export default {
    data() {
        return {
            loading: false,
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
                { text: "ИД", value: "category_id" },
                { text: "Категории", value: "category" },
                { text: "Domain", value: "domain"},
                { text: "Сумма", value: "sum", sortable: true}
            ],   
            productData: [],
            productHeader: [],       
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
            areas: {},
            categories: {}
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
            this.loading = true;
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
                var categoryData = [];

                this.areas = {}
                for (const res of responses) {
                    var chartData = {
                        host: res.data.host,
                        data: {}
                    }

                    var categories = {}
                    res.data.categories.forEach(cat => {
                        categories[cat.value] = cat.text
                    });

                    res.data.areas.forEach(area => {
                        if (!this.areas[res.data.host]) {
                            this.areas[res.data.host] = {}
                        }
                        this.areas[res.data.host][area.value] = area.text
                    });
                    
                    for (const data of res.data.data) {

                        var domainCat = { category_id: null, domain: res.data.host, sum: 0};
                        
                        for (const dealer in data) {
                            
                            if (dealer == 'category_id') {
                                domainCat.category_id = data[dealer];
                                domainCat.category = categories[data[dealer]];
                                continue;
                            }
                            if (!chartData.data[dealer]) {
                                chartData.data[dealer] = 0;
                            }
                            
                            if (data[dealer] != []) {
                                for (const day in data[dealer]) {
                                    chartData.data[dealer] += data[dealer][day];
                                    domainCat.sum += data[dealer][day];
                                    if (!lineData[day]) {
                                        lineData[day] = 0;
                                    }
                                    lineData[day] += data[dealer][day];
                                }
                            }                            
                        }

                        categoryData.push(domainCat);
                    }

                    this.setData(chartData)
                }
                this.categoryData = categoryData;

                this.line.chartOptions.xaxis.categories.forEach(day => {
                    if (lineData[day]) {
                        this.line.series[0].data.push(lineData[day])
                    }else{
                        this.line.series[0].data.push(0)
                    }
                });
                this.loading = false;
            }

        },

        async loadIntroduction(index){
            const item = this.categoryData[index]
            
            this.productHeader.splice(0)
            this.productHeader.push({ text: "Продукты", value: "name" });

            for (const area in this.areas[item.domain]) {
                this.productHeader.push({ text: this.areas[item.domain][area], value: area})
            }

            this.productHeader.push({ text: "Всего", value: "total" });

            var token = "";
            await axios.post("https://sdmanager.salesdoc.uz/api/v2/domain/jwt/token", 
                { user_id: this.user.user_id },
                { headers: { Authorization: 'Bearer ' + this.user.token } }
            ).then(response => {
                token = response.data.success.token
            }).catch(function(error){
                console.log(error);
            });

            await axios.post("https://"+item.domain+".salesdoc.io/api3/manager/index", 
                { id: "1", jsonrpc: "2.0", method: "getProductsCS", params: { ...this.fields, category_id: item.category_id} },
                { headers: { Authorization: 'Bearer ' + token } }
            ).then(response => {
                this.productData = response.data.data
            }).catch(function(error){
                console.log(error);
            });

            for (const header of this.productHeader) {
                for (const data of this.productData) {
                    if (!data[header.value]) {
                        data[header.value] = 0;
                    }else{
                        data[header.value] = data[header.value].toLocaleString()
                    }
                }
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

        exportData(data, header, title) {
            dataToExcel(data, header, title)
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

  .customize-table-inside {
    --easy-table-header-font-color: #fff;
    --easy-table-header-background-color: #c2c7d0;
  }
</style>

<style lang="scss" scoped>
  .card-list {
    --v-card-list-gap: 1.6rem;
  }
</style>
