<template>
    <div class="con-cah">
        <chart
					:options="pie"
					:init-options="initOptions"
					ref="pie"
					autoresize
					/>

    </div>
</template>
<script>
import ECharts from '@/components/echarts/ECharts.vue'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'

import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'


export default {
    components:{
        chart:ECharts
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
            initOptions: {
                renderer: 'canvas'
            },
            pie:{
                title: {
                    text: this.title,
                    x: 'center',
                    textStyle:{
                        color: '#71e3fe',
                        fontSize: 16
                    },
                    top:10
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                // legend: {
                //     orient: 'vertical',
                //     left: 'left',
                //     data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                // },
                series: [
                    {
                        name: this.title,
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        label: {
                            normal: {
                                formatter: '{b}  {d}% \n {c}',
                                 color: '#fff'
                            }
                        },
                        data: [

                        ],
                        itemStyle: {
                            emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
                }
        }
    },
    methods: {
        init() {
            var list = []
            for(var item of this.data){
                var value = item.value;
                var name = item.name;
                var color = item.color;
                list.push({
                    value: item.value, 
                    name: item.name ,
                    itemStyle:{
                        normal:{color:item.color}
                    
                    }
                })
            }
            this.pie.series[0].data = list   
        }
    },
    mounted(){
              this.init()
    }
}
</script>
<style  scoped>
.con-cah{
    width: 100%;
    height: 100%;
}
</style>