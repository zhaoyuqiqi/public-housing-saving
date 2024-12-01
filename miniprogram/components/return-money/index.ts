const list = [1, .7, .75, .8, .85, .9, .95, 1.05, 1.1, 1.2, 1.3]
const baseRatio = 2.85
const range = list.map((item, idx) => {
  let name = '基准利率'
  const ratio = (baseRatio * item).toFixed(2)
  if (item === 1) {
    name = `${name}（${ratio}%）`
  } else if (item > 1) {
    name = `${name}${item}倍（${ratio}%）`
  } else if (item < 1) {
    item = Number(`${item}`.split('.')[1])
    name = `${name}${item}折（${ratio}%）`
  }
  return {
    id: idx + 1,
    name
  }
})

Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    /** 贷款总金额 */
    returnMoney: 100,
    /** 利率列表 */
    range,
    /** 选择的利率 */
    autoReturn: '基准利率（2.85%）',
    returnRatio: baseRatio,
    returnYear: '30年（360期）',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindReturnRatioChange(e: any) {
      const idx = Number(e.detail.value)
      const selected = this.data.range[idx]
      this.setData({
        autoReturn: selected.name,
        returnRatio: Number((baseRatio * list[idx]).toFixed(2))
      })
    },
    computedReturnMoney() {
      const { returnYear, returnMoney, returnRatio } = this.data
      if (Number(returnMoney) < 0) {
        return wx.showToast({
          icon: 'none',
          title: '公积金贷款金额至少为0'
        })
      }
      if (Number.isNaN(Number(returnRatio))) {
        return wx.showToast({
          icon: 'none',
          title: '利率不合法'
        })
      }
      const years = parseInt(`${returnYear}`)
      const principal = returnMoney * 10000;
      const annualRate = Number(returnRatio)
      const totalMonths = years * 12;
      // const list = isMoreReturnType ? calculateLoanPayments(returnMoney * 10000,, month * 12) : calculateLoanPaymentsEqualPrincipal(returnMoney * 10000, Number(returnRatio), month * 12)
      wx.navigateTo({
        url: `/pages/return-money-detail/index?principal=${principal}&annualRate=${annualRate}&totalMonths=${totalMonths}`
      })
    }
  }
})