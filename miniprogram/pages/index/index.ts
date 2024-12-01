// index.ts



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

const yearsRange = Array.from({ length: 30 }).map((_, idx) => `${idx + 1}年（${(idx + 1) * 12}期）`)
Component({
  data: {
    city: [],
    /** 双边缴纳比例之和 */
    ratio: 24,
    /** 已缴纳月数 */
    month: 0,
    /** 月缴存额 */
    money: 0,
    /** 账户余额 */
    remainAmount: 0,
    yearsRange,
    year: '30年（360期）',
    result: 0,
    /** 是否是借款 */
    isBorrow: true,
    /** 贷款总金额 */
    returnMoney: 100,
    /** 利率列表 */
    range,
    /** 选择的利率 */
    autoReturn: '基准利率（2.85%）',
    returnRatio: baseRatio,
    returnYear: '30年（360期）',
  },

  methods: {
    radioChange(e: any) {
      this.setData({
        [e.target.dataset.type]: e.detail.value === '1'
      })
    },
    bindRegionChange: function (e: any) {
      this.setData({
        city: e.detail.value
      })
    },
    onYearsChange(e: any) {
      const type = e.target.dataset.type
      const value = e.detail.value
      this.setData({
        [type as 'year' | 'returnYear']: yearsRange[value]
      })
    },
    onChange(e: any) {
      const type = e.target.dataset.type
      const value = e.detail.value
      this.setData({
        [type as 'ratio' | 'month' | 'money']: value
      })
    },
    computedAmount() {
      const { money, month, year, ratio } = this.data
      if (Number(month) <= 0) {
        return wx.showToast({
          title: '缴纳月数须大于0',
          icon: 'none'
        })
      }
      if (Number(money) <= 0) {
        return wx.showToast({
          title: '月薪资须大于0',
          icon: 'none'

        })
      }
      if (Number(ratio) < 5 || Number(ratio) > 12) {
        return wx.showToast({
          title: '缴纳比例须介于5%-12%',
          icon: 'none'
        })
      }
      if (Number(year) <= 0 || Number(year) > 30) {
        return wx.showToast({
          title: '贷款年限须介于1-30',
          icon: 'none'
        })
      }
    },
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
  },
})
