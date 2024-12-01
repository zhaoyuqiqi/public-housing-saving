// pages/return-money-detail.ts
import { calculateLoanPayments, calculateLoanPaymentsEqualPrincipal } from "../../utils/utils"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    /** 等额本金 */
    equalPrincipalAmount: {
      /** 首月月供 */
      firstMonthAmount: 0,
      /** 逐月递减 */
      subAmountEveryMonth: 0,
      /** 总利息 */
      totalInterest: 0,
      /** 本息合计 */
      totalMoney: 0,
      /** 贷款金额 */
      loanMoney: 0,
      /**  贷款期限 */
      years: 0,
      list: [[]] as (number[])[]
    },
    /** 等额本息 */
    equalPrincipalAndInterest: {
      /** 月供 */
      monthReturn: 0,
      /**总利息 */
      totalInterest: 0,
      /** 本息合计 */
      totalMoney: 0,
      /** 贷款金额 */
      loanMoney: 0,
      /**  贷款期限 */
      years: 0,
      list: [[]] as (number[])[]
    }
  },
  changeActiveIndex(e: any) {
    const activeIndex = Number(e.currentTarget.dataset.index)
    this.setData({
      activeIndex
    })
  },
  onSwiperChange(e: any) {
    this.setData({
      activeIndex: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { principal, annualRate, totalMonths } = options as unknown as { principal: string; annualRate: string; totalMonths: string }
    this.setDetail(Number(principal), Number(annualRate), Number(totalMonths))
  },
  lastClickTime: Date.now(),

  toTop() {
    const now = Date.now()
    if (now - this.lastClickTime <= 200) {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    }
    this.lastClickTime = now
    // this.timer = setTimeout(() => {
    //   this.lastClickTime = now
    // }, 200);

  },
  setDetail(principal: number, annualRate: number, totalMonths: number) {
    const list = calculateLoanPayments(principal, annualRate, totalMonths)
    const list2 = calculateLoanPaymentsEqualPrincipal(principal, annualRate, totalMonths)
    if (list.length > 0) {
      const { monthlyPayment } = list[0]
      let totalInterest = 0
      let loanMoney = 0
      for (const item of list) {
        totalInterest = Number((totalInterest + Number(item.interestPayment)).toFixed(2))
        loanMoney = Number((loanMoney + Number(item.principalPayment)).toFixed(2))
      }
      let totalInterest2 = 0
      let loanMoney2 = 0
      for (const item of list2) {
        totalInterest2 = Number((totalInterest2 + Number(item.interestPayment)).toFixed(2))
        loanMoney2 = Number((loanMoney2 + Number(item.principalPayment)).toFixed(2))
      }
      this.setData({
        equalPrincipalAndInterest: {
          /** 月供 */
          monthReturn: Number(monthlyPayment),
          /**总利息 */
          totalInterest,
          /** 本息合计 */
          totalMoney: Number((loanMoney + totalInterest).toFixed(2)),
          /** 贷款金额 */
          loanMoney: Number((loanMoney / 10000).toFixed(2)),
          /**  贷款期限 */
          years: Math.round(list.length / 12),
          list: list.map(({ month, monthlyPayment, principalPayment, interestPayment, remainingBalance }) => ([month, monthlyPayment, principalPayment, interestPayment, remainingBalance]))
        },
        equalPrincipalAmount: {
          /** 首月月供 */
          firstMonthAmount: Number(list2[0].monthlyPayment),
          /** 逐月递减 */
          subAmountEveryMonth: Number((Number(list2[0].monthlyPayment) - Number(list2[1].monthlyPayment)).toFixed(2)),
          /** 总利息 */
          totalInterest: totalInterest2,
          /** 本息合计 */
          totalMoney: Number((loanMoney2 + totalInterest2).toFixed(2)),
          /** 贷款金额 */
          loanMoney: Number((loanMoney2 / 10000).toFixed(2)),
          /**  贷款期限 */
          years: Math.round(list.length / 12),
          list: list2.map(({ month, monthlyPayment, principalPayment, interestPayment, remainingBalance }) => ([month, monthlyPayment, principalPayment, interestPayment, remainingBalance]))
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})