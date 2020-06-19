<template>
    <div class="container">
        <div class="head">
            <!-- <div class="head-item">
                <img @click="prevYear" class="arrow" src="./img/left-arr.png" alt="">
                <div class="md-num">{{year}}</div>
                <img @click="nextYear" class="arrow" src="./img/right-arr.png" alt="">
            </div> -->

            <div class="head-item">
                <img @click="prevMonth" class="arrow" src="./img/left-quan.png" alt="">
                <div class="md-num"><span>{{year}}年</span><span class="bigmonth">{{month + 1}}</span>/月</div>
                <img @click="nextMonth" class="arrow" src="./img/right-quan.png" alt="">
            </div>
        </div>
        <!-- <div class="the-line"></div> -->
        <div class="week-list">
            <div v-for="w in weekList" :key="w" class="week-item">
                <span v-if="w > 0 && w <= finalWeek"> 第{{w}}周 </span>
            </div>
             
        </div>
        <div class="cal-list">
            <div class="cal-item">星期日</div>
            <div class="cal-item">星期一</div>
            <div class="cal-item">星期二</div>
            <div class="cal-item">星期三</div>
            <div class="cal-item">星期四</div>
            <div class="cal-item">星期五</div>
            <div class="cal-item">星期六</div>
            <div @click="select(item)" v-for="(item,index) in list" :key="index" class="cal-item">
                <div class="cal-item-d"  v-if="item.num"
                :class="{normal:item.isNormal,late:item.isLate,lack:item.isLack,leave:item.isLeave,opacity:item.isOpacity}">
                    <!-- <span v-if="item.str == nowStr" class="today">今</span> -->
                    <div style="font-size: 14px;">
                         <span v-if="!item.gongli && !item.nongli">{{item.lunar}}</span>
                        <span>{{item.gongli}}</span>
                       
                        <span>{{item.nongli}}</span>
                    </div>
                    <span>{{item.num}}</span>
                    <div :title="item.content" class="content-num">{{item.content}}</div>
                </div>
            </div>
            
        </div>
    </div>
</template>
<script>
export default {
    props:[
        "late",
        "lack",
        "leave",
        "normal",
        "time",
        'termStartDate',
        'termEndDate'
    ],
    watch:{
        late:function(indexVal, oldVal){
          this.initDateList(new Date(this.year,this.month,1));
        },
        lack:function(indexVal, oldVal){
          this.initDateList(new Date(this.year,this.month,1));
        },
        leave:function(indexVal, oldVal){
          this.initDateList(new Date(this.year,this.month,1));
        },
         normal:function(indexVal, oldVal){
          this.initDateList(new Date(this.year,this.month,1));
        },
         time:function(indexVal, oldVal){
          this.initDateList(new Date(indexVal));
        }
    },

    data(){
        return {
            list :[],
            weekList: [],
            finalWeek: 0,
            now:{},
            nowStr:"",
            year:0,
            month:0,
            // 农历
            solarTerms:{'0105':'小寒','0120':'大寒','0203':'立春','0218':'雨水','0305':'惊蜇','0320':'春分',
                        '0404':'清明','0419':'谷雨','0505':'立夏','0520':'小满','0605':'芒种','0621':'夏至',
                        '0706':'小暑','0722':'大暑','0807':'立秋','0822':'处暑','0907':'白露','0922':'秋分',
                        '1008':'寒露','1023':'霜降','1107':'立冬','1122':'小雪','1206':'大雪', '1221':'冬至',
                        '0101':'春节','0115':'元宵节','0505':'端午节','0707':'七夕情人节','0715':'中元节',
                        '0815':'中秋节','0909':'重阳节','1208':'腊八节','1224':'小年'},
            // 公历
            gregorian:{'0101':'元旦','0214':'情人节','0308':'妇女节','0312':'植树节','0315':'消费者权益日','0401':'愚人节',
                        '0501':'劳动节','0504':'青年节','0512':'护士节','0601':'儿童节','0701':'建党节','0801':'建军节',
                        '0910':'教师节','0928':'孔子诞辰','1001':'国庆节','1006':'老人节','1024':'联合国日','1224':'平安夜','1225':'圣诞节'},
            endMonth:''
        }
    },

    methods:{
        initDateList(date){
            this.list = [];

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

            this.list.push(this.getItem(first));

            while(true){
               
                var time = first.getTime();
                time += 1000 * 60 * 60 * 24;

                var nextDate = new Date(time);

                
                if(nextDate.getMonth() == first.getMonth()){
                     this.list.push(this.getItem(nextDate));

                    first = nextDate;
                }else{
                    break;
                }
            }

        
            // console.log("day:" + day);
            for(var i = 0;i<day;i++){
                var t = this.list[0].date.getTime() - 1000 * 60 * 60 * 24
                var d = new Date(t)
                var item = this.getItem(d)
                item.isOpacity = true
                this.list.unshift(item);
            }
            var endDate = this.list[this.list.length - 1]
            day = endDate.date.getDay();
             for(var i = 0;i<(6 - day);i++){
                var t = this.list[this.list.length - 1].date.getTime() + 1000 * 60 * 60 * 24
                var d = new Date(t)
                var item = this.getItem(d)
                item.isOpacity = true
                this.list.push(item);
            }

           
            this.initWeekList()
        },
        initWeekList () {
            if(!this.termStartDate && !this.termEndDate){
                return
            }
            // debugger
            this.weekList = []
            // console.log(this.list)
            // console.log('term date:', this.termStartDate)
            var startDate = new Date(this.termStartDate)
            var day = startDate.getDay()
            var startSunday = startDate.getTime() - 1000 * 60 * 60 * 24 * day
            startSunday = new Date(startSunday)
            startSunday.setHours(0)
             startSunday.setMinutes(0)
              startSunday.setSeconds(0)
              for(var item of this.list){
                  var itemDate = item.date
                  if(itemDate.getDay() == 0){
                       itemDate.setSeconds(10)
                      var offsetTime = itemDate.getTime() - startSunday.getTime()
                      var w = offsetTime / 1000 / 60 / 60 / 24 / 7
                    //   console.log(w)
                      w = Math.ceil(w)
                      this.weekList.push(w)
                  }
              }


              this.initFinalWeek()
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
            var str = this.dateToStr(d);
            var str2 = str.split('-')
            return {
                gongli:this.getGong(str2[1]+str2[2]),
                lunar:this.getLunarDay(str2[0],str2[1],str2[2]).day,
                nongli:this.getLunarDay(str2[0],str2[1],str2[2]).holiday,
                num:d.getDate(),
                str:str,
                date:d,
                isLate:this.isLate(d).flag,
                isLack:this.isLack(d).flag,
                isLeave:this.isLeave(d).flag,
                isNormal:this.isNormal(d).flag,
                content: this.isLate(d).flag ? this.isLate(d).content: this.isLack(d).flag? this.isLack(d).content:this.isLeave(d).flag?this.isLeave(d).content:this.isNormal(d).flag?this.isNormal(d).content:''
            }
        },

        isNormal(d){
             if(!this.normal){
                return false
            }
           var flag = false;
           for(var item of this.normal){
                
                var normalDate = new Date(item.time);
                var normalStr = normalDate.getFullYear()+"-"+normalDate.getMonth()+"-"+normalDate.getDate();
                var str = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
                if(normalStr == str){
                    flag = true;
                    var obj={flag:true,content:item.content}
                }
            }
            if(!flag)  var obj={flag:false,content:''}
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
                    var obj={flag:true,content:item.content}
                }
            }
            if(!flag)  var obj={flag:false,content:''}
            return obj;
        },

        isLack(d){
            if(!this.lack){
                return false
            }

            var flag = false;
            for(var item of this.lack){
                var lackDate = new Date(item.time);
                var lackStr = lackDate.getFullYear()+"-"+lackDate.getMonth()+"-"+lackDate.getDate();
                var str = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
                if(lackStr == str){
                    flag = true;
                    var obj={flag:true,content:item.content}
                }
            }
            if(!flag)  var obj={flag:false,content:''}
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
                    var obj={flag:true,content:item.content}
                }
            }
            if(!flag)  var obj={flag:false,content:''}
             return obj;
        },

        prevYear(){
            this.year --;

            this.initDateList(new Date(this.year,this.month,1));

            this.$emit('change',this.year,this.month);
        },

        nextYear(){
             this.year ++;

            this.initDateList(new Date(this.year,this.month,1));

             this.$emit('change',this.year,this.month);
        },

        prevMonth(){
            
            if(this.month == 0){
                this.month = 11;
                this.year --;
            }else{
                this.month --;
            }

            this.initDateList(new Date(this.year,this.month,1));

             this.$emit('change',this.year,this.month);
        },

        nextMonth(){
             if(this.month == 11){
                this.month = 0;
                this.year ++;
            }else{
                this.month ++;
            }

            this.initDateList(new Date(this.year,this.month,1));

            this.$emit('change',this.year,this.month);

             var date = new Date(this.year,this.month,1)
        },

        select(item){
            if(item.isOpacity){
                return
            }
            var d = item.date
            var year = d.getFullYear();
            var month = d.getMonth() >=9 ? d.getMonth() + 1 : '0' + ( d.getMonth() + 1);
            var date = d.getDate() >9 ? d.getDate() : '0' + d.getDate();
            var str = year + '-'+month+'-'+ date;

            // this.curDate = str;

            this.$emit('select',str);
           
        },
        dateToStr(d){
             var year = d.getFullYear();
            var month = d.getMonth() >=9 ? d.getMonth() + 1 : '0' + ( d.getMonth() + 1);
            var date = d.getDate() >=9 ? d.getDate() : '0' + d.getDate();
            var str = year + '-'+month+'-'+ date;
            return str;
        },
        // 农历
        getLunarDay (solarYear, solarMonth, solarDay) { 
        const madd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
        // const tgString = '甲乙丙丁戊己庚辛壬癸'
        // const dzString = '子丑寅卯辰巳午未申酉戌亥'
        const numString = '一二三四五六七八九十'
        const monString = '正二三四五六七八九十冬腊'
        const CalendarData = [0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95]
        if (!(solarYear < 1921 || solarYear > 2025)) {
            solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11
            const timeArr = [solarYear, solarMonth, solarDay]
            let TheDate = (timeArr.length !== 3) ? new Date() : new Date(timeArr[0], timeArr[1], timeArr[2])
            let total, m, n, k
            let isEnd = false
            let theDateYear = TheDate.getFullYear()
            total = (theDateYear - 1921) * 365 + Math.floor((theDateYear - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38
            if (theDateYear % 4 === 0 && TheDate.getMonth() > 1) {
            total++
            }
            for (m = 0; ; m++) {
            k = (CalendarData[m] < 0xfff) ? 11 : 12
            for (n = k; n >= 0; n--) {
                if (total <= this.getBit(CalendarData[m], n)) {
                isEnd = true
                break
                }
                total = total - this.getBit(CalendarData[m], n)
            }
            if (isEnd) {
                break
            }
            }
            let cMonth, cDay // cYear,
            // cYear = 1921 + m
            cMonth = k - n + 1
            cDay = total
            var nongli
            var yuefen
            if(cMonth<10){
                yuefen = '0'+cMonth
            }else{
                yuefen = cMonth
            }
            if(cDay<10){
                nongli = '0'+cDay
            }else{
                nongli = cDay
            }
            // var holiday = this.getFestival('0404')
            // console.log(yuefen, nongli, yuefen + '' + nongli)
          
            var holiday = this.getFestival(yuefen + '' + nongli)
            if (k === 12) {
            if (cMonth === Math.floor(CalendarData[m] / 0x10000) + 1) {
                cMonth = 1 - cMonth
            }
            if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
                cMonth--
            }
            }
            // let run = ''
            let cDayStr = numString.charAt(cDay - 1)
            /* if (cMonth < 1) {
            run = '(闰)'
            } */
            if (cDay % 10 !== 0 || cDay === 10) {
            cDayStr = numString.charAt((cDay - 1) % 10)
            }
           var nl={day: cDay === 1 ? monString.charAt(cMonth - 1) + '月' : (cDay < 11 ? '初' : (cDay < 20 ? '十' : (cDay < 30 ? '廿' : '三十'))) + cDayStr, holiday:holiday}
            return nl  // tgString.charAt((cYear - 4) % 10) + dzString.charAt((cYear - 4) % 12) + '年 ' + run + monString.charAt(cMonth - 1) + '月' +
        }
        },
        getBit (m, n) { // 处理二进制数据的
        return 29 + ((m >> n) & 1)
        },
        // 获取农历节日
        getFestival(data){
            
            // console.log(data, this.solarTerms[data])
           return this.solarTerms[data]
        },
        // 获取公历节日
        getGong(data){
           return this.gregorian[data]
        }
    },

    mounted(){
        this.now = new Date();
        this.nowStr = this.dateToStr(this.now);
        this.initDateList(new Date(this.time));
    }
}
</script>
<style scoped>
.container{
      
   
   
}
.head{
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
}
.head-item{
    display: inline-block;

}
.arrow{
    display: inline-block;
    vertical-align: middle;
    padding: 0 5px;
    width: 20px;
    height: 20px;
}
.md-num{
    display: inline-block;
    width: 125px;
    vertical-align: middle;
    text-align: center;
    font-size: 16px;

}
.the-line{
    width: 90%;
    margin: 10px auto 0 auto;
    border-top: #e5e5e5 1px solid;
}
.week-list{
    float: left;
    width: 10%;
    padding: 56px 0 0 0;
}
.week-item{
    padding: 5px 0;
    height: 80px;
    line-height: 80px;
    text-align: center;
}
.cal-list{
    /* display: flex;
    justify-content: space-between;
    flex-wrap:wrap; */
    overflow: hidden;
    margin-top: 20px;
    width: 90%;
    float: left;
}
.cal-item{
    width: 14%;
    text-align: center;
    padding: 5px 0;
   font-size: 20px;
    float: left;
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
    width: 157px;
    height: 72px;
    border-radius: 10px;
    line-height: 22px;
    margin: 0 auto;
    cursor: pointer;
    /* line-height: 80px; */
    background-color: #F5F5F5;
    padding-top: 8px;
}
/* 教职工休息 */
.normal{
    background: #77DA85;
    color: #fff !important;
}
/* 学生休息 */
.late{
    background: #157BDA;
    color: #fff !important;
}
/* 师生均休息 */
.lack{
    background: #7FD4FF;
    color: #fff;
}
/* 特殊安排 */
.leave{
    background: #F73400;
    color: #fff;
}
.opacity{
    opacity: 0.1;
}
.today{
    color:#ff8800;
}
.late .today{
    color: #fff;
}
.bigmonth{
    font-size: 36px;
    font-weight: bold;
    margin-right: 10px;
}
.content-num{
    font-size: 14px;
     width: 140px;
    margin: 0 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
