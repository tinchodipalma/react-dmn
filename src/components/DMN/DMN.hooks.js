import React, { useContext, useMemo } from 'react';
import DMNContext from './DMN.context';

export const useReactDMN = () => {
  const dmnContext = useContext(DMNContext);

  const reactDMNData = useMemo(() => ({
    ...dmnContext
  }), [dmnContext.dmn, dmnContext.current.view])

  return reactDMNData;
}