function Swiper (opt) {
    this.id = opt.id
    this.childClass = opt.childClass
    this.time = opt.time || 5000
    this.distance = opt.distance || 5
    this.showDot = opt.showDot || true
    this.loop = true
    if (opt.loop == false) {
        this.loop = false
    }
    this.second = 0.3
    this.transition = this.second
    this.index = 1
    this.slidesLength = 1
    this.timer = null
    this.timer1 = null
    this.timer2 = null

    this.conWidth = 100

    this.dotList = []

    this.init()

    var self = this
    if (this.loop) {
        this.timer = setTimeout(function(){
       
            self.next()
        }, this.time)
    }
    
    
}
Swiper.prototype.init = function () {
   
    var self = this
    var sliderCon = document.querySelector('#' + this.id)
    this.conWidth = sliderCon.offsetWidth
    console.log(this.conWidth)
    sliderCon.ontouchstart = function(e){
        self.clear()
        sliderCon.style.transition = '0s'
       
        this.x = e.targetTouches[0].clientX
        this.y = e.targetTouches[0].clientX

        this.left = sliderCon.style.left
     
       
    }
    sliderCon.ontouchmove = function(e){
     
        var moveX = e.targetTouches[0].clientX
        var moveY = e.targetTouches[0].clientX
        this.offsetX = moveX - this.x
        this.offsetY = moveY - this.y
      // console.log(this.offsetX, this.offsetY)
    
      var left = parseInt(this.left.replace('px', ''))
     
      sliderCon.style.left = (left + this.offsetX) + 'px'     
        
    }
    sliderCon.ontouchend = function(){
        
        sliderCon.style.transition = self.second + 's'
        self.transition = self.second + 's'
      
        
        if (!this.offsetX) {
            this.offsetX = -(self.distance + 1)
        }
     
        if (this.offsetX < -self.distance) {
            self.next()
        }
        if (-self.distance < this.offsetX < 0) {
            self.spring(self.index - 1)
        }

        if (this.offsetX > self.distance) {
            self.prev()
        }
        if (0 < this.offsetX < self.distance) {
            self.spring(self.index - 1)
        }
    }



    var SlideDom = sliderCon.getElementsByClassName(this.childClass)
    this.slidesLength = SlideDom.length
    
  
    if (this.slidesLength > 1) {
        var cloneDom1 = SlideDom[0].cloneNode(true) // 向最后append
        var cloneDom2 = SlideDom[this.slidesLength - 1].cloneNode(true) // 向最前append
        document.querySelector('#' + this.id).insertBefore(cloneDom2, SlideDom[0])
        document.querySelector('#' + this.id).appendChild(cloneDom1)

        

        this.createDot()

        this.setLeft()
    } else {
        this.transition = 0
        this.index = 0
    }

    var domList = sliderCon.getElementsByClassName(this.childClass)
    sliderCon.style.width = domList.length * this.conWidth + 'px'
    for(item of domList) {
        item.style.width = this.conWidth + 'px'
    }

   
}
Swiper.prototype.createDot = function () {
    var self = this
    var indicatorList = document.createElement('div')
        indicatorList.classList.add("banner-indicator")
        document.getElementById(this.id).parentNode.appendChild(indicatorList)
        for(let i = 0;i<this.slidesLength;i++){
            var indicator = document.createElement('div')
            indicator.classList.add("banner-indicator-item")
            if (i == 0) {
                indicator.classList.add("banner-show-bgcolor")
            }
            indicator.onclick = function(){
                self.spring(i)
            }
            indicatorList.appendChild(indicator)

            this.dotList.push(indicator)
        }
}
Swiper.prototype.setLeft = function () {
    var self = this

 
    var dom = document.getElementById(this.id)
    dom.style.transition = this.transition + 's'
    dom.style.left = -(this.index * this.conWidth) + 'px'
    
    // var dotList =  document.querySelectorAll('.banner-indicator-item')
    var dotList =  this.dotList
    for (var i = 0;i<dotList.length;i++){
        dotList[i].classList.remove('banner-show-bgcolor')
    }

    
    var dotIndex = this.index - 1
    if (dotIndex < 0) {
        dotIndex = this.slidesLength-1
    }
    if (dotIndex > this.slidesLength-1) {
        dotIndex = 0
    }
    dotList[dotIndex].classList.add('banner-show-bgcolor')
   
    if (this.index > this.slidesLength) {
        this.timer1 = setTimeout(function(){
             self.transition = 0
             self.index = 1
             self.setLeft()
           
             self.timer2 = setTimeout(function() {
                self.transition = self.second
            }, self.second * 1000)
        }, self.second * 1000)
    }


    if (this.index < 1) {
        this.timer1 = setTimeout(function() {
           self.transition = 0
            self.index = self.slidesLength
            self.setLeft()
          
           self.timer2 = setTimeout(function() {
               self.transition = self.second
           }, self.second * 1000)
       }, self.second * 1000)
   }
   

}
Swiper.prototype.next = function () {
    var self = this
    if (this.slidesLength == 1) {
        return
    }

      this.index++
      this.setLeft()
   
    if (this.loop) {
        this.timer = setTimeout(function(){
            self.next()
        }, this.time)
    }
   
}
Swiper.prototype.prev = function () {
    var self = this
    if (this.slidesLength == 1) {
        return
    }
    this.index--
    this.setLeft()

    if (this.loop) {
        this.timer = setTimeout(function(){
            self.prev()
        }, this.time)
    }
    
}
Swiper.prototype.spring = function(index) {
    this.clear()
    var self = this
    if (this.slidesLength == 1) {
        return
    }
   
     this.index = index + 1
     this.setLeft()
    
    if (this.loop) {
        this.timer = setTimeout(() => {
            self.next()
        }, this.time)
    }
    
}
Swiper.prototype.clear = function() {
    clearTimeout(this.timer)
    clearTimeout(this.timer1)
    clearTimeout(this.timer2)
}