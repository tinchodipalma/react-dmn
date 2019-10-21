import { UPDATE_DMN_DEFINITION, UPDATE_DMN_INSTANCE, UPDATE_DMN_CURRENT } from './DMN.constants';

export const INITIAL_STATE = {
  dmn: null,
  definition: null,
  current: {
    view: null,
    viewer: null,
  },
};

const DMNReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_DMN_DEFINITION:
      return {
        ...state,
        definition: action.payload,
      };

    case UPDATE_DMN_INSTANCE:
      return {
        ...state,
        dmn: action.payload,
      };

    case UPDATE_DMN_CURRENT:
      return {
        ...state,
        current: {
          ...state.current,
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

export default DMNReducer;