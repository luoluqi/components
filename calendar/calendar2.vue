<template>
    <div>
        <div v-for="(item2,index2) in listArr" :key="index2" class="container">
            <div class="head">
                <div class="head-item">
                    <div class="md-num">{{item2.year}}-{{ (item2.month) < 10 ? '0'+ (item2.month) : (item2.month)}}</div>
                </div>
            </div>
            <div class="week-list">
                <!-- {{item2.weekList}}{{finalWeek}} -->
                 <div v-for="w in item2.weekList" :key="w" class="week-item">
                    <span v-if="w == 1 && w <= finalWeek">{{w}}ST</span>
                    <span v-if="w == 2 && w <= finalWeek">{{w}}ND</span>
                    <span v-if="w == 3 && w <= finalWeek">{{w}}RD</span>
                    <span v-if="w > 3 && w <= finalWeek">{{w}}TH</span>
                </div>
                
            </div>
            <div class="cal-list">
                <div class="cal-item active">日</div>
                <div class="cal-item">一</div>
                <div class="cal-item">二</div>
                <div class="cal-item">三</div>
                <div class="cal-item">四</div>
                <div class="cal-item">五</div>
                <div class="cal-item active">六</div>
                <div >
                    
                </div>
                <div @click="select(item,item2)" @dblclick="doubleSelect(item,item2)" v-for="(item,index) in item2.list" :key="index" class="cal-item">
                    <div class="cal-item-d" 
                    :class="{normal:item.isNormal,late:item.isLate,studentLeave:item.isStudentLeave,teacherLeave:item.isTeacherLeave,leave:item.isLeave,select:item.isSelect,opacity: item.isOpacity}">
                        <!-- <span v-if="item.str == nowStr" class="today">今</span> -->
                        <span>{{item.num}}</span>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    
</template>
<script>
import {mapState, mapGetters} from 'vuex'
export default {
    props:[
        "isSelectType",
        "late",
        "studentLeave",
        "teacherLeave",
        'leave',
        'termTime',
        'termStartDate',
        'termEndDate'
    ],
    watch:{
        late:function(indexVal, oldVal){
           this.getCalendar()
        },
        studentLeave:function(indexVal, oldVal){
           this.getCalendar()
        },
        teacherLeave:function(indexVal, oldVal){
           this.getCalendar()
        },
        leave:function(indexVal, oldVal){
           this.getCalendar()
        },
        termTime:function(indexVal, oldVal){
            this.getCalendar()
            // this.getyearmonth(indexVal.begin,indexVal.end)
            // this.getNodate(indexVal.begin,indexVal.end)
        },
        termStartDate:function(indexVal, oldVal){
            this.getCalendar()
           
        },
        termEndDate:function(indexVal, oldVal){
            this.getCalendar()
           
        },
        isSelectType:function(indexVal, oldVal){
            this.getCalendar()
            // this.getyearmonth(indexVal.begin,indexVal.end)
            // this.getNodate(indexVal.begin,indexVal.end)
        }
    },

    data(){
        return {
            list :[],
            finalWeek: 0,
            now:{},
            nowStr:"",
            year:'2020',
            month: '1',
            dateArr: [],
            listArr: [],
            singleDate: ''
        }
    },
    computed: {
      ...mapGetters(['roleCode']),
    },
    methods:{
        initDateList(date){
            var list = [];

            if(date){
              
                date = new Date(date.getFullYear(),date.getMonth(),1);
            }else{
                 date = new Date();
                date = new Date(date.getFullYear(),date.getMonth(),1);
            }
            
            var year = date.getFullYear();
            this.year = year;

            var month = date.getMonth();
            this.month = month

            var d = date.getDate();
            var day = date.getDay();
            var first = new Date(year,month,1);

            list.push(this.getItem(first));

            while(true){
               
                var time = first.getTime();
                time += 1000 * 60 * 60 * 24;

                var nextDate = new Date(time);

                
                if(nextDate.getMonth() == first.getMonth()){
                     list.push(this.getItem(nextDate));

                    first = nextDate;
                }else{
                    break;
                }
            }
            // console.log(list)
            // console.log("day:" + day);
            for(var i = 0;i<day;i++){
                var t = list[0].date.getTime() - 1000 * 60 * 60 * 24
                var d = new Date(t)
                var item = this.getItem(d)
                item.isOpacity = true
                list.unshift(item);
            }
            var endDate = list[list.length - 1]
            day = endDate.date.getDay();
             for(var i = 0;i<(6 - day);i++){
                var t = list[list.length - 1].date.getTime() + 1000 * 60 * 60 * 24
                var d = new Date(t)
                var item = this.getItem(d)
                item.isOpacity = true
                list.push(item);
            }

           return list

        },

        initWeekList (list) {

            if(!this.termStartDate && !this.termEndDate){
                return
            }
            // debugger
            var weekList = []
            // console.log(list)
            // console.log('term date:', this.termStartDate)
            var startDate = new Date(this.termStartDate)
            var day = startDate.getDay()
            var startSunday = startDate.getTime() - 1000 * 60 * 60 * 24 * day
            startSunday = new Date(startSunday)
            startSunday.setHours(0)
             startSunday.setMinutes(0)
              startSunday.setSeconds(0)
              for(var item of list){
                  var itemDate = item.date
                  if(itemDate.getDay() == 0){
                       itemDate.setSeconds(10)
                      var offsetTime = itemDate.getTime() - startSunday.getTime()
                      var w = offsetTime / 1000 / 60 / 60 / 24 / 7
                    //   console.log(w)
                      w = Math.ceil(w)
                      weekList.push(w)
                  }
              }
              
            //   console.log('weekList' ,weekList)
             return weekList
        },
        initFinalWeek () {
             var startDate = new Date(this.termStartDate)
            var day = startDate.getDay()
            var startSunday = startDate.getTime() - 1000 * 60 * 60 * 24 * day
            startSunday = new Date(startSunday)
            startSunday.setHours(0)
             startSunday.setMinutes(0)
              startSunday.setSeconds(0)

              var endDate = new Date(this.termEndDate)
              day = endDate.getDay()
              var endSunday = endDate.getTime() - 1000 * 60 * 60 * 24 * day
              endSunday = new Date(endSunday)
               endSunday.setSeconds(10)
               var offsetTime = endSunday.getTime() - startSunday.getTime()
                var w = offsetTime / 1000 / 60 / 60 / 24 / 7
                w = Math.ceil(w)

                this.finalWeek = w

        },

        getItem(d){
            // console.log(this.isNormal(d).flag)
            var str = this.dateToStr(d);
            return {
                num:d.getDate(),
                str:str,
                date:d,
                isSelect: this.isSelect(d).flag,
                isLate: this.isLate(d).flag,
                isStudentLeave: this.isStudentLeave(d).flag,
                isTeacherLeave: this.isTeacherLeave(d).flag,
                isLeave: this.isLeave(d).flag,
                isNormal: this.isNormal(d).flag,
                content: this.isLate(d).flag ? this.isLate(d).content : this.isStudentLeave(d).flag ? this.isStudentLeave(d).content : this.isTeacherLeave(d).flag ? this.isTeacherLeave(d).content : this.isLeave(d).flag ? this.isLeave(d).content: this.isNormal(d).flag ? this.isNormal(d).content : ''
            }
        },

        isNormal(d){
            if(!this.noDate){
                return false
            }
            var flag = false;
            var str = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
            var obj =''
            this.noDate.forEach(
                (item)=>{
                    var lateDate = new Date(item);
                    var lateStr = lateDate.getFullYear()+"-"+lateDate.getMonth()+"-"+lateDate.getDate()
                    if (lateStr == str) {
                        flag = true;
                        obj = {flag: true, content:''}
                    }
                }
                
            )
            if (!flag) obj = {flag:false, content:''}
            // console.log(obj)
            return obj;
        },
        

        isLate(d){
            if(!this.late){
                return false
            }

            var flag = false;
            for(var item of this.late){
                
                var lateDate = new Date(item.time);
                var lateStr = lateDate.getFullYear()+"-"+lateDate.getMonth()+"-"+lateDate.getDate();
                var str = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
                if(lateStr == str){
                    flag = true;
                    var obj = {flag: true,content:item.content}
                }
            }
             if (!flag) var obj = {flag:false,content:''}
            return obj;
        },

        isStudentLeave(d){
            if(!this.studentLeave){
                return false
            }

            var flag = false;
            for(var item of this.studentLeave){
                var lackDate = new Date(item.time);
                var lackStr = lackDate.getFullYear()+"-"+lackDate.getMonth()+"-"+lackDate.getDate();
                var str = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
                if(lackStr == str){
                    flag = true;
                    var obj = {flag: true,content:item.content}
                }
            }
            if (!flag) var obj = {flag:false,content:''}
             return obj;
        },

        isTeacherLeave(d){
            if(!this.teacherLeave){
                return false
            }

            var flag = false;
            for(var item of this.teacherLeave){
                var leaveDate = new Date(item.time);
                var leaveStr = leaveDate.getFullYear()+"-"+leaveDate.getMonth()+"-"+leaveDate.getDate();
                var str = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
                if(leaveStr == str){
                    flag = true;
                    var obj = {flag: true,content:item.content}
                }
            }
            if (!flag) var obj = {flag:false,content:''}
            return obj;
        },
        isLeave(d){
            if(!this.leave){
                return false
            }

            var flag = false;
            for(var item of this.leave){
                var leaveDate = new Date(item.time);
                var leaveStr = leaveDate.getFullYear()+"-"+leaveDate.getMonth()+"-"+leaveDate.getDate();
                var str = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
                if(leaveStr == str){
                    flag = true;
                    var obj = {flag: true,content:item.content}
                }
            }
            if (!flag) var obj = {flag:false,content:''}
            return obj;
        },
        isSelect (d) {
            if(!this.dateArr){
                return false
            }

            var flag = false;
            for(var item of this.dateArr){
                var leaveDate = new Date(item);
                var leaveStr = leaveDate.getFullYear()+"-"+leaveDate.getMonth()+"-"+leaveDate.getDate();
                var str = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
                if(leaveStr == str){
                    flag = true;
                    var obj = {flag: true,content:item.content}
                }
            }
            if (!flag) var obj = {flag:false,content:''}
            return obj;
        },
        clearSelect () {
            this.listArr.forEach(
                item=>{
                    item.list.forEach(
                        item2 =>{
                            item2.isSelect = false
                        }
                    )
                }
            )
        },
        select(item,item2){
            if (item.isNormal) {
                return
            }
            
            var d = item.date
            var year = d.getFullYear();
            var month = d.getMonth() >=9 ? d.getMonth() + 1 : '0' + ( d.getMonth() + 1);
            var date = d.getDate() >9 ? d.getDate() : '0' + d.getDate();
            var str = year + '-'+month+'-'+ date;
            // this.curDate = str;
            // if(item.isLate||item.isStudentLeave||item.isTeacherLeave||item.isLeave){
            //     this.$emit('chooseWho',{flag:true,item:str})
            //     return
            // }
            if(this.roleCode != 'SchoolAdmin'){
                return
            }
            var flag = false
            this.dateArr.forEach(
                (item, index) => {
                    if (item == str) {
                        flag = true
                        this.dateArr.splice(index,1)
                    }
                }
            )
            if(!flag) this.dateArr.push(str)
            this.$emit('select',this.dateArr);
            for(let i = 0; i<item2.list.length;i++){
                 
                if(item2.list[i].str == str){
                    
                    if(item2.list[i].isSelect){
                        var temp = Object.assign(item2.list[i],{isSelect:false})
                    }else {
                        var temp = Object.assign(item2.list[i],{isSelect:true})
                    }
                   
                   
                }else{
                     var temp = Object.assign(item2.list[i],{isSelect:item2.list[i].isSelect})
                  
                }

                item2.list.splice(i,1,temp)
            }
        },
        // 点击两次
        doubleSelect(item,item2){
            if (item.isNormal) {
                return
            }
            
            var d = item.date
            var year = d.getFullYear();
            var month = d.getMonth() >=9 ? d.getMonth() + 1 : '0' + ( d.getMonth() + 1);
            var date = d.getDate() >9 ? d.getDate() : '0' + d.getDate();
            var str = year + '-'+month+'-'+ date;
            // this.curDate = str;
            if(item.isLate||item.isStudentLeave||item.isTeacherLeave||item.isLeave){
                this.$emit('chooseWho',{flag:true,item:str})
                return
            }
            if(this.roleCode != 'SchoolAdmin'){
                return
            }
            var flag = false
            this.dateArr.forEach(
                (item, index) => {
                    if (item == str) {
                        flag = true
                        this.dateArr.splice(index,1)
                    }
                }
            )
            if(!flag) this.dateArr.push(str)
            this.$emit('select',this.dateArr);
            for(let i = 0; i<item2.list.length;i++){
                 
                if(item2.list[i].str == str){
                    
                    if(item2.list[i].isSelect){
                        var temp = Object.assign(item2.list[i],{isSelect:false})
                    }else {
                        var temp = Object.assign(item2.list[i],{isSelect:true})
                    }
                   
                   
                }else{
                     var temp = Object.assign(item2.list[i],{isSelect:item2.list[i].isSelect})
                  
                }

                item2.list.splice(i,1,temp)
            }
        },
        dateToStr(d){
             var year = d.getFullYear();
            var month = d.getMonth() >=9 ? d.getMonth() + 1 : '0' + ( d.getMonth() + 1);
            var date = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
            var str = year + '-'+month+'-'+ date;
            return str;
        },
        getyearmonth(sdate, edate) {
            
            var syear = parseInt(sdate.split('-')[0], 10), smonth = parseInt(sdate.split('-')[1], 10)
            var eyear = parseInt(edate.split('-')[0], 10), emonth = parseInt(edate.split('-')[1], 10)
            var result = []
            while((syear * 12 + smonth) <= (eyear * 12 + emonth)){
                result.push(syear +'-'+ ('0' + smonth).slice(-2) + '-01')
                if(++smonth > 12){
                    syear++;
                    smonth = 1
                }
            }
            
            return result
        },
        getNodate (sdate, edate) {
            var syear = parseInt(sdate.split('-')[0], 10), smonth = parseInt(sdate.split('-')[1], 10), sday=parseInt(sdate.split('-')[2], 10)
            var eyear = parseInt(edate.split('-')[0], 10), emonth = parseInt(edate.split('-')[1], 10), eday=parseInt(edate.split('-')[2], 10)
            var result = []
            for (var i = 1; i < sday; i++) {
                result.push(syear +'-'+ ('0' + smonth).slice(-2) + '-'+ ('0' + i).slice(-2))
            }
            for (var i = eday+1; i <= 31; i++) {
                result.push(eyear +'-'+ ('0' + emonth).slice(-2) + '-'+ ('0' + i).slice(-2))
            }
            this.noDate = result
        },
        getCalendar(){
            this.initFinalWeek()

            this.listArr = []
            if (this.dateArr.length>0){
                this.dateArr = []
            }else{
                
            }
            
            var timeArr = this.getyearmonth(this.termTime.begin, this.termTime.end)
            this.getNodate(this.termTime.begin, this.termTime.end)
            this.now = new Date();
            this.nowStr = this.dateToStr(this.now)
            timeArr.forEach(item => {
                var time = item.split('-')
                // console.log(parseInt(time[1]) + 1)
            
                var year = parseInt(time[0])
                var month = parseInt(time[1]) 
                var dateList = this.initDateList(new Date(item))
                var weekList = this.initWeekList(dateList)
                
                var obj = {
                    year: year, 
                    month: month, 
                    list: dateList,
                    weekList: weekList
                }
                this.listArr.push(obj) 
                this.clearSelect()
            })
        }

    },

    mounted() {
       this.getCalendar()
        // console.log(this.listArr)
    }
}
</script>
<style scoped>
.container{
    display: inline-block;
    width: 300px;
    min-height: 260px;
    overflow: hidden;
    padding: 20px;
}
.head{
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
}
.head-item{
    width: 100%;
    display: inline-block;

}
.arrow{
    display: inline-block;
    vertical-align: middle;
    padding: 0 5px;
   
}
.md-num{
    width: 100%;
    text-align: center;
    font-weight: bold;
}
.the-line{
    width: 90%;
    margin: 10px auto 0 auto;
    border-top: #e5e5e5 1px solid;
}
.week-list{
      float:left;
    width: 10%;
    padding: 30px 0 0 0;
}
.week-item{
    height: 34px;
    line-height: 30px;
}
.cal-list{
    /* display: flex;
    justify-content: space-between;
    flex-wrap:wrap; */
    float:left;
    width: 90%
}
.cal-item{
    margin-left: 12px;
    color: #000;
    width: 24px;
    text-align: center;
    padding: 5px 0;
    float: left;
}
.active{
    color: #7FD4FF;
}
.foot{
    clear: both;
}


.chekType{
    overflow: hidden;
    width: 6rem;
    margin: 0 auto;
    margin-top: 0.2rem;
    clear: both;
}
.chekType li{
    font-size: 0.24rem;
    float: left;
    color: #999999;
    margin-left: 0.5rem;

}
.chekType li i{
    width: 0.16rem;
    height: 0.16rem;
    border-radius: 0.16rem;
    background-color: #ffad32;
    display: inline-block;
    margin-right: 0.08rem
}
.kuang{
    background-color: #ff7070 !important;
}
.qingjia{
    background-color: #4bb0f4 !important;
}
.zheng{
    background-color: #f2f2f2 !important;
}

.cal-item-d{
    border-radius: 50%;
    line-height: 24px;
    margin: 0 auto;
    cursor: pointer;
    background: #f5f5f5;
}
.normal{
    color: #999;
    background: #fff;
}
.late{
    background: #F73400;
    color: #fff;
}
.studentLeave{
    background: #157BDA;
    color: #fff;
}
.teacherLeave{
    background: #77DA85;
    color: #fff;
}

.leave{
    background: #7FD4FF;
    color: #fff;
}
.opacity{
    opacity: 0.1;
}
.select{
    background: url('./img/choosed.png') no-repeat;
    background-size: 100%;
    color: #000;
}
.today{
    color:#ff8800;
}
.late .today{
    color: #fff;
}
</style>
