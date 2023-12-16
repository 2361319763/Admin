import React, { createContext, useContext, useReducer } from 'react';

// 定义事件类型
type Action = {
  type: string;
  payload?: any;
};

// 定义全局事件状态和派发函数类型
type GlobalEventState = {
  events: Record<string, Array<Function>>;
};

type GlobalEventDispatch = React.Dispatch<Action>;

// 创建全局事件上下文
const GlobalEventContext = createContext<{
  state: GlobalEventState;
  dispatch: GlobalEventDispatch;
} | undefined>(undefined);

// Reducer函数处理事件注册、注销和触发
function eventReducer(state: GlobalEventState, action: Action): GlobalEventState {
  switch (action.type) {
    case 'SUBSCRIBE':
      const { eventName, handler } = action.payload || {};
      return {
        ...state,
        events: {
          ...state.events,
          [eventName]: [...(state.events[eventName] || []), handler],
        },
      };
    case 'UNSUBSCRIBE':
      const { eventName: unsubEventName, handler: unsubHandler } = action.payload || {};
      return {
        ...state,
        events: {
          ...state.events,
          [unsubEventName]: state.events[unsubEventName]?.filter((h) => h !== unsubHandler),
        },
      };
    case 'DISPATCH':
      const { eventName: dispatchEventName, data } = action.payload || {};
      if (state.events[dispatchEventName]) {
        state.events[dispatchEventName].forEach((handler) => handler(data));
      }
      return state;
    default:
      return state;
  }
}

// 创建全局事件提供器
export const GlobalEventProvider: React.FC<{children: React.ReactNode;}> = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, { events: {} });

  return (
    <GlobalEventContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalEventContext.Provider>
  );
};

// 自定义Hook，用于访问全局事件状态和派发函数
export const useGlobalEvent = () => {
  const context = useContext(GlobalEventContext);
  if (!context) {
    throw new Error('useGlobalEvent must be used within a GlobalEventProvider');
  }
  const { state, dispatch } = context;
  
  // 订阅事件
  const subscribe = (eventName: string, handler: Function) => {
    dispatch({ type: 'SUBSCRIBE', payload: { eventName, handler } });
  };
  
  // 取消订阅事件
  const unsubscribe = (eventName: string, handler: Function) => {
    dispatch({ type: 'UNSUBSCRIBE', payload: { eventName, handler } });
  };
  
  // 触发事件
  const dispatchEvent = (eventName: string, data?: any) => {
    dispatch({ type: 'DISPATCH', payload: { eventName, data } });
  };

  return { state, subscribe, unsubscribe, dispatchEvent };
};
