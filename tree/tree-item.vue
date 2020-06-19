<template>
    <div class="tree-item">
       
        <div v-if="data.children"  class="tree-name">
            <!-- <div class="icon-p">
                <x-icon class="icon-color" v-show="!isOpen" type="ios-plus-outline" size="30"></x-icon>
              <x-icon v-show="isOpen" type="ios-minus-outline" size="30"></x-icon>
            </div> -->
            <!-- <img  class="checkbox middle" src="@/assets/img/checkbox.png" alt=""> -->
            <div class="middle dept-info"> 
                 <div class="middle dept-name">{{data.label}}<span>({{countNum}}人)</span></div> 
                 <div class="xiaji"  @click="open">
                     <img src="@/assets/img/subsd.png" class="subsd middle" alt="">
                     下级
                 </div>
                 
             </div>
        </div>
         <div  v-else class="tt-name" @click="select(data)" :class="{'selected': isSelected}">
             <img v-if="isSelected" class="checkbox middle" src="@/assets/img/checkbox-a.png" alt="">
             <img v-else class="checkbox middle" src="@/assets/img/checkbox.png" alt="">
             <div class="middle man-info"> 
                 <img v-if="data.img" :src="data.img" @error="defaultBackImg" class="head-img middle">
                 <img v-else src="@/assets/img/default_head.png" class="head-img middle" alt="">
                 <div class="middle">{{data.label}}</div> 
             </div>
           
        </div>
        <div class="tree-list" :class="{'open': isOpen, 'close': !isOpen}" v-if="data.children">
            <tree-item 
           
            v-for="(item, index) in data.children" 
            :key="index"
           
            :data="item" 
            :props="props"></tree-item>
        </div>
        
    </div>
</template>
<script>
import { Group } from 'vux'
export default {
    name: 'treeItem',
    components: {
        Group
    },
    props: ['data', 'props'],
    computed:{
        tearcherList(){
            return this.$store.state.selectTeacher.teacherList
        }
    },
    data () {
        return {
            isOpen: false,
            isSelected: false,
            countNum: 0
        }
    },
    methods: {
        defaultBackImg() {
            if(event.type == "error") {
            event.target.src = require("../../assets/img/default_head.png")
            }
        },
        open () {
            this.isOpen = !this.isOpen
        },
        select (data) {
            this.isSelected = !this.isSelected
            if (this.isSelected) {
               
                this.$store.commit('selectTeacher/selectTeacher', data)
            } else {
                 this.$store.commit('selectTeacher/unselectTeacher', data)
            }
        },
       
        count(arr){
           if(!arr){
               return
           }
                for(var item of arr){
                    if(item.children){
                        this.count(item.children)
                    }else {
                        this.countNum++
                    }
                }
            
        }
    },
    mounted () {
        this.$set(this.data, 'label', this.data[this.props.label])
        // this.$set(this.data, 'isLeaf', this.data[this.props.isLeaf])
        this.$set(this.data, 'children', this.data[this.props.children])
      
        var flag = false
        for (var item of this.tearcherList) {
            if (this.data[this.props.id] == item[this.props.id]) {
                this.isSelected = true
            }
        }

        this.count(this.data.children)
    }    
}
</script>
<style scoped>
.tree-item{
    padding: 0rem 0 0rem 0.3rem;
    background: #fff;
    font-size: 0.3rem;
    /* border-top: 1px solid #D9D9D9; */
}
.tree-list{
  transition: 0.5s;
  overflow: hidden;
}
.close{
    height: 0px;
     transition: 0.5s;
}
.open{
     transition: 0.5s;
     height: auto;
}
.icon-p{
    display: inline-block;
    vertical-align: middle;
     fill:#1AAD19;
}

.name-p{
    display: inline-block;
    vertical-align: middle;
}
.tt-name{
   
}
.selected{
   
}
.checkbox{
    display:inline-block;
    width: 0.4rem;
    height: 0.4rem;
}
.middle{
    display:inline-block;
    vertical-align: middle;
}
.head-img{
    display: inline-block;
    width: 0.72rem;
    height: 0.72rem;
    border-radius: 50%;
    margin:0 0.18rem;
}
.man-info{
   padding: 0.2rem 0;
        width: calc(100% - 0.5rem);
    border-bottom: 1px solid rgba(229,229,229,1);
}
.dept-info{
     padding: 0.3rem 0;
        width: calc(100% - 0.5rem);
    border-bottom: 1px solid rgba(229,229,229,1);
}
.subsd{
    display: inline-block;
    width: 0.32rem;
    height: 0.28rem;
}
.dept-name{
    display: inline-block;
     margin:0 0.18rem;
}
.xiaji{
    float:right;
    color:#128FEF;
    margin: 0 0.3rem 0 0;
}
</style>
