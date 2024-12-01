Page({
  data: {
    /** 是否是借款 */
    isBorrow: true,
  },
  radioChange(e: any) {
    this.setData({
      [e.target.dataset.type]: e.detail.value === '1'
    })
  },
})
