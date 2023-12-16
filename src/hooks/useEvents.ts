import { useReducer, createContext, useContext, Dispatch } from 'react';

interface GlobalState {
  refresh: number;
}

type Action = {
  type: 'REFRESH';
  payload?: number;
};

type DispatchType = Dispatch<Action>;

const useEvents = () => {
  const initialState = {
    refresh: 0,
  }
  
  const reducer = (state:GlobalState, action:Action) => {
    let newState = {...state};
    switch (action.type) {
      case 'REFRESH':
        newState.refresh ++;
        break;
      default:
        break;
    }
    return newState;
  }
  
  

  
  const [state, dispatch] = useReducer(reducer,  initialState);

  return {
    state,
    dispatch
  }
}
export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('createContext创建失败');
  }
  return context;
};

export const GlobalContext = createContext<{
  state: GlobalState;
  dispatch: DispatchType;
} | undefined>(undefined);

export default useEvents;