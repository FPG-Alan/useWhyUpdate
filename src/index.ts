import { useLayoutEffect } from "react";
/**
 * track the reason of component re render
 */
const __REACT_DEVTOOLS_GLOBAL_HOOK__ = "__REACT_DEVTOOLS_GLOBAL_HOOK__";
function whyUpdate(name: string) {
  const rendererID = 1;
  const globalHook = (window as any)[__REACT_DEVTOOLS_GLOBAL_HOOK__];
  const fiberRoot = globalHook
    ?.getFiberRoots?.(rendererID)
    ?.values()
    ?.next()?.value;
  console.group(`${name} render for reasons: `);
  if (fiberRoot) {
    let fiberNode = fiberRoot.current;
    // get correspond fiber node
    while (fiberNode) {
      if (
        typeof fiberNode.type === "function" &&
        fiberNode.type.name === name
      ) {
        break;
      }

      if (fiberNode.child) {
        fiberNode = fiberNode.child;
      } else if (fiberNode.sibling) {
        fiberNode = fiberNode.sibling;
      } else {
        let tmpReturnNode = fiberNode.return;
        while (tmpReturnNode) {
          if (tmpReturnNode.sibling) {
            fiberNode = tmpReturnNode.sibling;
            break;
          }

          tmpReturnNode = tmpReturnNode.return;
        }

        if (!tmpReturnNode) {
          fiberNode = null;
        }
      }
    }

    if (fiberNode && fiberNode !== fiberRoot.current) {
      let hasReason = false;
      // test if props changed...
      const changedProps = Object.entries(fiberNode.pendingProps).reduce(
        (ps: any, [k, v]) => {
          if (fiberNode.alternate.memoizedProps[k] !== v) {
            ps[k] = [fiberNode.alternate.memoizedProps[k], v].join("->");
          }
          return ps;
        },
        {}
      );
      if (Object.keys(changedProps).length > 0) {
        hasReason = true;
        console.log(`props change, Changed props: \n `, changedProps);
      }

      // test if state changed
      const currentStates = [];
      const prevStates: any[] = [];
      let memoizedState = fiberNode.memoizedState;
      while (memoizedState) {
        // only care about useState, useEffect, useCallback, useLayoutEffect, etc has no `baseState`
        if (memoizedState.baseState) {
          currentStates.push(memoizedState.baseState);
        }
        memoizedState = memoizedState.next;
      }
      memoizedState = fiberNode.alternate.memoizedState;
      while (memoizedState) {
        if (memoizedState.baseState) {
          prevStates.push(memoizedState.baseState);
        }
        memoizedState = memoizedState.next;
      }

      const changedState = currentStates.reduce((acc, state, index) => {
        if (prevStates[index] !== state) {
          acc[index] = `${prevStates[index]} -> ${state}`;
        }
        return acc;
      }, {});

      if (Object.keys(changedState).length > 0) {
        hasReason = true;
        console.log(`state change, Changed state: \n `, changedState);
      }
      const changedContext = {};
      if (fiberNode.dependencies) {
        let context = fiberNode.dependencies.firstContext;
        while (context) {
          Object.entries(context.memoizedValue).reduce((cc: any, [k, v]) => {
            if (context.context._currentValue[k] !== v) {
              cc[k] = [context.context._currentValue[k], v].join("->");
            }
            return cc;
          }, changedContext);

          context = context.next;
        }
        if (Object.keys(changedContext).length > 0) {
          hasReason = true;
          console.log(
            `context value change, Changed context: \n`,
            changedContext
          );
        }
      }

      if (!hasReason) {
        console.log(`parent render`);
      }
    } else {
      console.log(`unknown reason`);
    }

    return;
  }
  console.log(`mount`);
  console.groupEnd();
}
function useWhyUpdate(name: string) {
  useLayoutEffect(() => {
    whyUpdate(name);
  });
}

export default useWhyUpdate;
