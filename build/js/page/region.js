module.exports = function(){
  return {
    data: {
      html: '',
      html1: '123',
      regionList: [],
      url: '/yue/html?html=http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2016/44.html',
      queryCount: 0,
      classList: ['.citytr', '.countytr', '.towntr', '.villagetr']
    },
    methods: {
      getHtml () {
        // Yue.get('/yue/html?html=http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2016/53.html', (data) => {
        //   this.html = data
        //   this.setData()
        // })
      },
      doLoad (url, index) {
        this.queryCount ++
        Yue.loadFrame(url , (win, dom, iframe) => {
          this.queryCount --
          var trList = [].slice.call(dom.querySelectorAll(this.classList[index]))
          trList.forEach(a => {
            var arr = [].slice.call(a.querySelectorAll('td'))
            var link = arr[0].querySelector('a')
            var href = link && link.getAttribute('href')
            if (arr.length) {
              this.regionList.push({
                id: this.resetId(arr[0].textContent.trim()),
                name: this.resetId(arr.pop().textContent.trim())
              })
            }
            if (href) {
              this.doLoad(this.resetUrl(url, href), index + 1)
            }
          })
          iframe.remove()
          if (this.queryCount === 0) {
            console.log(window.regionList = this.regionList)
            console.log(JSON.stringify(regionList))
            console.log('load end')
          }
        })
      },
      resetId (id) {
        if (id.length === 12) {
          if(id.endsWith('000')) {
            return this.resetId(id.slice(0,9))
          }
          return id
        }
        if (id.length === 9) {
          if(id.endsWith('000')) {
            return this.resetId(id.slice(0,6))
          }
          return id
        }
        if(id.endsWith('00')) {
          return this.resetId(id.slice(0,-2))
        }
        return id
      },
      resetUrl (url, href) {
        console.log('resetUrl', url, href)
        return url.replace(/\w+\.html$/, '') + href
      }
    },
    created () {
      // this.doLoad(this.url, 0)
      window.loadRegion = (id, index = 1) => {
        this.regionList = []
        this.doLoad('/yue/html?html=http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2016/44/'+id+'.html', index)
      }
    }
  }
}