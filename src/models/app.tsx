export default {
  namespace: 'app',
  state: {
    login: false,
    loading: true,
    updateVersionData: {show: false, speed: 0}, // 进度条
    additional: false, // ➕显示
  },
  reducers: {
    updateState(state: any, {payload}: any) {
      return {...state, ...payload};
    },
  },
};
