export default {
  namespace: 'app',
  state: {
    login: false,
    loading: true,
    progress: {show: false, speed: 0},
    fetching: false,
  },
  reducers: {
    updateState(state: any, {payload}: any) {
      console.log('updateState', payload);
      return {...state, ...payload};
    },
  },
};
