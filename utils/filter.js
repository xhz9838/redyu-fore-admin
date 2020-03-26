import Vue from 'vue'

Vue.filter('fileSizeFormat', function(value) {
    if (!value) {
      return '0 Bytes'
    }
    var unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var index = 0
    var srcsize = parseFloat(value)
    index = Math.floor(Math.log(srcsize) / Math.log(1024))
    var size = srcsize / Math.pow(1024, index)
    size = size.toFixed(2)
    return size + ' ' + unitArr[index]
  })
  