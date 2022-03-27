import { IUser } from 'src/types';
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { IRootState } from '..';
import { IState } from './types';

const state = (): IState => {
  return {
    user: null,
  };
};

const getters: GetterTree<IState, IRootState> = {
  getUser(state) {
    return state.user;
  },
  getPermission(state) {
    if (state.user !== null) {
      return state.user?.permission;
    }

    return [];
  },
  getIsLogin(state) {
    return state.user !== null;
  },
};

const mutations: MutationTree<IState> = {
  setUser(state, user: IUser) {
    state.user = user;
  },
};

const actions: ActionTree<IState, IRootState> = {};

const authModule: Module<IState, IRootState> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default authModule;
