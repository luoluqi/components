<template>
   
       
        <div class="item-p">
            <chart
            :options="bar"
            :init-options="initOptions"
            ref="bar"
            theme="ovilia-green"
            autoresize
            />
        </div>
       
  
</template>
<script>
import ECharts from '@/components/echarts/ECharts.vue'
import 'echarts/lib/chart/bar'

import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'



export default {
    components: {
        chart: ECharts
    },
    props:{
        //[{name:"推荐量",color:"#34243",value:123},
	//{name:"阅读量",color:"#34243",value:123},
	//{name:"转发量",color:"#34243",value:123},
	//{name:"收藏量",color:"#34243",value:123}
	//]
        data: {
            type:Array,
            default:[]
        },
        title: {
            type:String,
            default:''
        }
    },
    watch:{
        data(newVal,oldVue){
           this.init()
        }
    },
    data(){
        return {
          
            bar:{
                // title: {
                //     text: this.title,
                //     x: 'center',
                //     textStyle:{
                //         color: '#71e3fe',
                //         fontSize: 16
                //     },
                //     top:10
                // },
                // tooltip: {
                //     trigger: 'axis',
                //     axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                //         type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                //     }
                // },
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '3%',
                    top:'15%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true,
                            lineStyle: {
                                color:'#666666'
                            }
                        },
                        axisLabel: {
                            color: '#666666'
                        },
                        axisLine: {
                            lineStyle: {
                                color:'#666666'
                            } 
                        }
                        
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        show:false
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'bar',
                        barWidth: '40%',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: [
                           
                            
                        ]
                        
                    }
                ]
            },
            
            initOptions: {
                renderer: 'canvas'
            },
        }
    },
    methods: {
        init() {
           
            var list = []
            var xAxisData = []
            for(var item of this.data){
                var value = item.value;
                var name = item.name;
                var color = item.color;
                list.push( {
                    value:value,
                    name:item.name,
                    itemStyle:{
                        normal:{color:color}
                    }
                })
                xAxisData.push(name)
            }
            this.bar.series[0].data = list   
            this.bar.xAxis[0].data = xAxisData
        }
    },
    mounted(){
              this.init()
    }
}
</script>
<style scoped>
.item-p{
    width: 100%;
    height: 100%;
}
</style>