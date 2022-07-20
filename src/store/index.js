import Vue from 'vue'
import Vuex from 'vuex'
import { httpGet } from '@/utils/axios.js'
Vue.use(Vuex)
const state = {
  musicData: {},
  currentMusicInfo: {
    currentTime: 0,
    nextId: null,
    lastId: null
  },
  likeIdList: [],
  myPlayList: [],
  account: {},
  profile: {},
  isLogin: window.sessionStorage.getItem('isLogin') === 'true',
  historyList: window.localStorage.getItem('setHistoryInfo') ? JSON.parse(window.localStorage.getItem('setHistoryInfo')) : []
}
const actions = {
  getMyPlayList ({ commit, state }) {
    httpGet(`/api/user/playlist`, {
      uid: state.profile.userId,
      limit: 30
    }, (res) => {
      if (res.data.code !== 200) return
      commit('setMyPlayList', res.data.playlist)
    })
  },
  getLikeList ({ commit, state }) {
    httpGet(`/api/likelist`, {
      uid: state.profile.userId
    }, (res) => {
      commit('setLikeIdList', {
        type: 'add',
        data: res.data.ids
      })
    })
  },
  getAcount ({ commit, dispatch }) {
    httpGet(`/api/user/account`).then(res => {
      console.log(res, 'rescount')
      if (res.data.account !== null) {
        commit('setLoginInfo', res.data)
        commit('setIsLogin', true)
        dispatch('getMyPlayList')
        dispatch('getLikeList')
      } else {
        commit('setLoginInfo', { account: {}, profile: {} })
        commit('setIsLogin', false)
        Vue.prototype.$notify({
          title: '提示',
          type: 'warning',
          dangerouslyUseHTMLString: true,
          message:
                `<section>本网站不会收集用户信息，点击头像可以登录,建议使用二维码或验证码登录</section>
                `
        })
      }
    })
  },
  logout ({ commit, state }) {
    if (!state.isLogin) { return Vue.prototype.$message.warning('似乎并没有登录') }
    Vue.prototype.$confirm('将要退出登录, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        httpGet(`/api/logout`).then(res => {
          Vue.prototype.$message.success('退出成功')
          commit('setLoginInfo', { account: null, profile: null })
          commit('setIsLogin', false)
        })
      })
      .catch(() => {
        Vue.prototype.$message({
          type: 'info',
          message: '已取消'
        })
      })
  }
}
const mutations = {
  setMusicInfo (state, data) {
    state.musicData = {
      ...state.musicData,
      ...data
    }
  },
  setHistoryInfo (state, data) {
    let newHistouryList = state.historyList
    if (data.type === 'add') {
      if (newHistouryList.find(item => item.id === data.musicDetail.id)) {
        return
      }
      newHistouryList.push(data.musicDetail)
    } else if (data.type === 'delete') {
      newHistouryList = newHistouryList.filter(item => {
        return item.id !== data.musicDetail.id
      })
    } else if (data.type === 'clear') {
      newHistouryList = []
    }
    window.localStorage.setItem('setHistoryInfo', JSON.stringify(newHistouryList))
    state.historyList = newHistouryList
  },
  setMyPlayList (state, list) {
    state.myPlayList = list
  },
  setLikeIdList (state, data) {
    if (data.type === 'add') {
      state.likeIdList = data.data
    } else if (data.type === 'unshift') {
      state.likeIdList.unshift(data.data)
    } else if (data.type === 'remove') {
      state.likeIdList.splice(
        state.likeIdList.indexOf(data.data), 1
      )
    }
  },
  setIsLogin (state, isLogin) {
    state.isLogin = isLogin
    if (isLogin) {
      window.sessionStorage.setItem('isLogin', true)
    } else {
      window.sessionStorage.removeItem('isLogin')
    }
  },
  setLoginInfo (state, loginInfo) {
    state.account = loginInfo.account
    state.profile = loginInfo.profile
  }
}
const store = new Vuex.Store({
  state,
  actions,
  mutations
})
export default store
