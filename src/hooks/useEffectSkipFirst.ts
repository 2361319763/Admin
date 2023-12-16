import { useCallback,useEffect,useRef } from 'react';
export default (fn: any,deps: any) => {
  const isFirstRun = useRef(true);
  const execFunc = useCallback(fn,deps);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    execFunc();
  },[execFunc])
};