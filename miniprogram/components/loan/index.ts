// components/loan/index.ts

import { getYearsRange } from "../../utils/utils"
const yearsRange = getYearsRange()
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
    city: [],
    cityCode: '',
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
    isMarriaged: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindRegionChange: function (e: any) {
      const { value: city, code } = e.detail
      this.setData({
        city,
        cityCode: code[code.length - 1] || ''
      })
    },
    onChange(e: any) {
      const type = e.target.dataset.type
      const value = e.detail.value
      this.setData({
        [type as 'ratio' | 'month' | 'money']: Number(value)
      })
    },
    onYearsChange(e: any) {
      const type = e.target.dataset.type
      const value = e.detail.value
      this.setData({
        [type as 'year' | 'returnYear']: yearsRange[value]
      })
    },
    computedAmount() {
      const { money, month, year, ratio, cityCode, remainAmount, city } = this.data
      if (!cityCode) {
        return wx.showToast({
          title: '请选择城市',
          icon: 'none'
        })
      }
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
      if (Number(ratio) < 10 || Number(ratio) > 24) {
        return wx.showToast({
          title: '缴纳比例须介于10%-24%',
          icon: 'none'
        })
      }
      if (parseInt(year) <= 0 || parseInt(year) > 30) {
        return wx.showToast({
          title: '贷款年限须介于1-30',
          icon: 'none'
        })
      }
      const params = `cityCode=${cityCode}&paidMonths=${Number(month)}&monthlyDeposit=${Number(money)}&accountBalance=${Number(remainAmount)}&sumOfBilateralRatio=${Number(ratio)}&companyRatio=${Number((Number(ratio) / 2).toFixed(2))}&selfRatio=${Number((Number(ratio) / 2).toFixed(2))}&loanLife=${parseInt(year)}`
      console.log(`https://gongjijin.zhaoyuqi.top:30443/public-housing-saving/loan-info?${params}`);
      wx.request({
        url: `https://gongjijin.zhaoyuqi.top:30443/public-housing-saving/loan-info?${params}`,
        method: 'GET',
        success: (res) => {
          const { code, data: amount } = res.data as { code: number; data: number; msg: string }
          const options = {
            title: '可贷额度',
            content: '',
          }
          if (res.statusCode === 200 && code === 0) {
            options.content = `在${city.join('')}您最大可贷款${amount}元（${Number((amount/10000).toFixed(2))}万元）`
          } else {
            options.content = `暂无${city.join('')}的公积金贷款信息，已向管理员反馈`
          }
          wx.showModal(options)
        },
        fail() {
          wx.showToast({ icon: 'error', title: '网络错误请稍后再试' })
        }
      })
    }
  }
})