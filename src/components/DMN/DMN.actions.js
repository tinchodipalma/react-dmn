import { UPDATE_DMN_DEFINITION, UPDATE_DMN_INSTANCE, UPDATE_DMN_CURRENT } from './DMN.constants';

export const updateDMNDefinition = (payload) => ({ type: UPDATE_DMN_DEFINITION, payload });
export const updateDMNInstance = (payload) => ({ type: UPDATE_DMN_INSTANCE, payload });
export const updateDMNCurrent = (payload) => ({ type: UPDATE_DMN_CURRENT, payload });