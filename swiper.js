function Swiper (opt) {
    this.id = opt.id
    this.time = opt.time || 3000
    this.showDot = opt.showDot || true
    this.transition = 0.5
    this.index = 1
    this.slidesLength = 1
    this.timer = null
    this.timer1 = null
    this.timer2 = null

    this.dotList = []

    this.init()

    var self = this
    setTimeout(function(){
       
        self.next()
    }, this.time)
    
}
Swiper.prototype.init = function () {
    var self = this
    var SlideDom = document.querySelector('#' + this.id).getElementsByClassName('banner-img')
    this.slidesLength = SlideDom.length
    if (this.slidesLength > 1) {
        var cloneDom1 = SlideDom[0].cloneNode(true) // 向最后append
        var cloneDom2 = SlideDom[this.slidesLength - 1].cloneNode(true) // 向最前append
        document.querySelector('#' + this.id).insertBefore(cloneDom2, SlideDom[0])
        document.querySelector('#' + this.id).appendChild(cloneDom1)

        

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

        this.setLeft()
    } else {
        this.transition = 0
        this.index = 0
    }

   
}
Swiper.prototype.setLeft = function () {
    var dom = document.getElementById(this.id)
    dom.style.transition = this.transition + 's'
    dom.style.left = -(this.index * 100) + '%'
    
    // var dotList =  document.querySelectorAll('.banner-indicator-item')
    var dotList =  this.dotList
    for (var i = 0;i<dotList.length;i++){
        dotList[i].classList.remove('banner-show-bgcolor')
    }
  
    if (this.index > this.slidesLength) {
        dotList[0].classList.add('banner-show-bgcolor')
    } else {
        dotList[this.index-1].classList.add('banner-show-bgcolor')
    }
   

}
Swiper.prototype.next = function () {
    var self = this
    if (this.slidesLength == 1) {
        return
    }

      this.index++
      this.setLeft()

    if (this.index > this.slidesLength) {
        this.timer1 = setTimeout(function(){
             self.transition = 0
             self.index = 1
             self.setLeft()
           
             self.timer2 = setTimeout(function() {
                self.transition = 0.5
            }, 500)
        }, 500)
    }
    this.timer = setTimeout(function(){
        self.next()
    }, this.time)
}
Swiper.prototype.prev = function () {
    var self = this
    if (this.slidesLength == 1) {
        return
    }
    this.index--
    this.setLeft()

    if (this.index < 1) {
         this.timer1 = setTimeout(function() {
            self.transition = 0
             self.index = self.slidesLength
             self.setLeft()
           
            self.timer2 = setTimeout(function() {
                self.transition = 0.5
            }, 500)
        }, 500)
    }
    this.timer = setTimeout(function(){
        self.prev()
    }, this.time)
}
Swiper.prototype.spring = function(index) {
    this.clear()
    var self = this
    if (this.slidesLength == 1) {
        return
    }
   
     this.index = index + 1
     this.setLeft()
    
    
    this.timer = setTimeout(() => {
        self.next()
    }, this.time)
}
Swiper.prototype.clear = function() {
    clearTimeout(this.timer)
    clearTimeout(this.timer1)
    clearTimeout(this.timer2)
}