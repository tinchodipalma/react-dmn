import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DmnViewer from 'dmn-js';
import DmnModeler from 'dmn-js/lib/Modeler';
import DMNContext from './DMN.context';
import DMNReducer, { INITIAL_STATE } from './DMN.reducer';
import { updateDMNDefinition, updateDMNInstance, updateDMNCurrent } from './DMN.actions';

import 'dmn-js/dist/assets/diagram-js.css';
import 'dmn-js/dist/assets/dmn-js-shared.css';
import 'dmn-js/dist/assets/dmn-js-drd.css';
import 'dmn-js/dist/assets/dmn-js-decision-table.css';
import 'dmn-js/dist/assets/dmn-js-decision-table-controls.css';
import 'dmn-js/dist/assets/dmn-js-literal-expression.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn.css';

import './DMN.css';

const DMN = ({ definition, isModeler, container, decisionTable, viewsSelector }) => {
  if (!definition) {
    return null;
  }

  const [state, dispatch] = useReducer(DMNReducer, INITIAL_STATE);

  useEffect(() => {
    const DmnConstructor = isModeler ? DmnModeler : DmnViewer;

    const dmnInstance = new DmnConstructor({
      container: `#${container}`,
      keyboard: {
        bindTo: window
      },
    });

    dispatch(updateDMNDefinition(definition));
    dispatch(updateDMNInstance(dmnInstance));

    dmnInstance.on('views.changed', (event) => {
      const view = event.activeView;
      dispatch(updateDMNCurrent({
        view,
      }));
    });

    dmnInstance.importXML(definition, (err) => {
      if (err) {
        console.log('DMN Error Rendering:', err);
      } else {
        const viewer = dmnInstance.getActiveViewer();

        dispatch(updateDMNCurrent({ viewer }));

        // access active editor components
        const canvas = viewer.get('canvas');

        // zoom to fit full viewport
        canvas.zoom('fit-viewport');
      }
    });

    return () => { };
  }, []);

  const getViewTypes = () => {
    const views = state.dmn.getViews();

    const viewTypes = views.reduce((prev, current) => {
      if (!prev[current.type]) {
        prev[current.type] = {};
      }

      prev[current.type] = {
        ...prev[current.type],
        [current.element.id]: current.element,
      };

      return prev;
    }, {});
  };

  const dmnContextProviderValue = {
    ...state,
    getViewTypes,
  };

  const dmnClassNames = classnames(
    'DMN__DiagramContainer',
    {
      [`DMN__CurrentView__${state.current.view}`]: state.current.view,
      'DMN__CustomView': state.current.view && state.current.view.type === 'decisionTable' && decisionTable,
    }
  );

  return (
    <DMNContext.Provider value={dmnContextProviderValue}>
      <div className="DMN__Container">
        <div id={container} className={dmnClassNames} />
        {!!viewsSelector &&
          <div className="DMN__ViewsSelector">
            {viewsSelector}
          </div>
        }
        {!!decisionTable && state.current.view && state.current.view.type === 'decisionTable' &&
          <div className="DMN__DecisionTable">
            {decisionTable}
          </div>
        }
      </div>
    </DMNContext.Provider>
  )
};

DMN.defaultProps = {
  isModeler: false,
  decisionTable: null,
  viewsSelector: null,
};

DMN.propTypes = {
  isModeler: PropTypes.bool,
  decisionTable: PropTypes.any,
  viewsSelector: PropTypes.any,
  container: PropTypes.string.isRequired,
  definition: PropTypes.string.isRequired,
};

export default DMN;
