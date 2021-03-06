'use strict';
function _interopDefault(ex) {
  return ex && 'object' == typeof ex && 'default' in ex ? ex.default : ex;
}
Object.defineProperty(exports, '__esModule', {value: !0});
var reactDom = _interopDefault(require('react-dom')),
  react = _interopDefault(require('react'));
const {unstable_batchedUpdates: unstable_batchedUpdates} = reactDom;
var ReactBatchedUpdates = {unstable_batchedUpdates: unstable_batchedUpdates};
let batch = function () {
  throw new Error('No batching function specified.');
};
var Recoil_batch = {
  setBatch: newBatch => (batch = newBatch),
  batchUpdates: callback => batch(callback),
};
function _defineProperty(obj, key, value) {
  return (
    key in obj
      ? Object.defineProperty(obj, key, {
          value: value,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (obj[key] = value),
    obj
  );
}
class AbstractRecoilValue {
  constructor(newKey) {
    _defineProperty(this, 'key', void 0), (this.key = newKey);
  }
}
class RecoilState extends AbstractRecoilValue {}
class RecoilValueReadOnly extends AbstractRecoilValue {}
var Recoil_RecoilValue = {
    AbstractRecoilValue: AbstractRecoilValue,
    RecoilState: RecoilState,
    RecoilValueReadOnly: RecoilValueReadOnly,
    isRecoilValue: function (x) {
      return x instanceof RecoilState || x instanceof RecoilValueReadOnly;
    },
  },
  Recoil_RecoilValue_1 = Recoil_RecoilValue.AbstractRecoilValue,
  Recoil_RecoilValue_2 = Recoil_RecoilValue.RecoilState,
  Recoil_RecoilValue_3 = Recoil_RecoilValue.RecoilValueReadOnly,
  Recoil_RecoilValue_4 = Recoil_RecoilValue.isRecoilValue;
function getCjsExportFromNamespace(n) {
  return (n && n.default) || n;
}
var require$$4 = getCjsExportFromNamespace(
  Object.freeze({
    __proto__: null,
    AbstractRecoilValue: Recoil_RecoilValue_1,
    RecoilState: Recoil_RecoilValue_2,
    RecoilValueReadOnly: Recoil_RecoilValue_3,
    isRecoilValue: Recoil_RecoilValue_4,
  }),
);
class DefaultValue {}
const DEFAULT_VALUE = new DefaultValue();
class RecoilValueNotReady extends Error {
  constructor(key) {
    super(
      `Tried to set the value of Recoil selector ${key} using an updater function, but it is an async selector in a pending or error state; this is not supported.`,
    );
  }
}
const nodes = new Map(),
  recoilValues = new Map();
class NodeMissingError extends Error {}
var Recoil_Node = {
  nodes: nodes,
  recoilValues: recoilValues,
  registerNode: function (node) {
    if (nodes.has(node.key)) {
      node.key;
    }
    nodes.set(node.key, node);
    const recoilValue =
      null == node.set
        ? new require$$4.RecoilValueReadOnly(node.key)
        : new require$$4.RecoilState(node.key);
    return recoilValues.set(node.key, recoilValue), recoilValue;
  },
  getNode: function (key) {
    const node = nodes.get(key);
    if (null == node)
      throw new NodeMissingError(
        `Missing definition for RecoilValue: "${key}""`,
      );
    return node;
  },
  NodeMissingError: NodeMissingError,
  DefaultValue: DefaultValue,
  DEFAULT_VALUE: DEFAULT_VALUE,
  RecoilValueNotReady: RecoilValueNotReady,
};
var Recoil_Queue = {
  enqueueExecution: function (s, f) {
    f();
  },
};
var Recoil_CopyOnWrite = {
  setByAddingToSet: function (set, v) {
    const next = new Set(set);
    return next.add(v), next;
  },
  setByDeletingFromSet: function (set, v) {
    const next = new Set(set);
    return next.delete(v), next;
  },
  mapBySettingInMap: function (map, k, v) {
    const next = new Map(map);
    return next.set(k, v), next;
  },
  mapByUpdatingInMap: function (map, k, updater) {
    const next = new Map(map);
    return next.set(k, updater(next.get(k))), next;
  },
  mapByDeletingFromMap: function (map, k) {
    const next = new Map(map);
    return next.delete(k), next;
  },
};
var Recoil_Tracing = {
  trace: function (message, node, fn) {
    return fn();
  },
  wrap: function (fn) {
    return fn;
  },
};
const {
    mapByDeletingFromMap: mapByDeletingFromMap$1,
    mapBySettingInMap: mapBySettingInMap$1,
    mapByUpdatingInMap: mapByUpdatingInMap$1,
    setByAddingToSet: setByAddingToSet$1,
  } = Recoil_CopyOnWrite,
  {getNode: getNode$1} = Recoil_Node,
  emptyMap = Object.freeze(new Map()),
  emptySet = Object.freeze(new Set());
class ReadOnlyRecoilValueError extends Error {}
function getNodeLoadable(store, state, key) {
  return getNode$1(key).get(store, state);
}
let subscriptionID = 0;
var Recoil_FunctionalCore = {
  getNodeLoadable: getNodeLoadable,
  peekNodeLoadable: function (store, state, key) {
    return getNodeLoadable(store, state, key)[1];
  },
  setNodeValue: function (store, state, key, newValue) {
    const node = getNode$1(key);
    if (null == node.set)
      throw new ReadOnlyRecoilValueError(
        'Attempt to set read-only RecoilValue: ' + key,
      );
    const [newState, writtenNodes] = node.set(store, state, newValue);
    return [newState, writtenNodes];
  },
  setUnvalidatedAtomValue: function (state, key, newValue) {
    return {
      ...state,
      atomValues: mapByDeletingFromMap$1(state.atomValues, key),
      nonvalidatedAtoms: mapBySettingInMap$1(
        state.nonvalidatedAtoms,
        key,
        newValue,
      ),
      dirtyAtoms: setByAddingToSet$1(state.dirtyAtoms, key),
    };
  },
  subscribeComponentToNode: function (state, key, callback) {
    const subID = subscriptionID++;
    return [
      {
        ...state,
        nodeToComponentSubscriptions: mapByUpdatingInMap$1(
          state.nodeToComponentSubscriptions,
          key,
          subsForAtom =>
            mapBySettingInMap$1(
              null != subsForAtom ? subsForAtom : emptyMap,
              subID,
              ['TODO debug name', callback],
            ),
        ),
      },
      function (state) {
        return {
          ...state,
          nodeToComponentSubscriptions: mapByUpdatingInMap$1(
            state.nodeToComponentSubscriptions,
            key,
            subsForAtom =>
              mapByDeletingFromMap$1(
                null != subsForAtom ? subsForAtom : emptyMap,
                subID,
              ),
          ),
        };
      },
    ];
  },
  fireNodeSubscriptions: function (store, updatedNodes, when) {
    var _store$getState$nextT;
    const state =
        'enqueue' === when &&
        null !== (_store$getState$nextT = store.getState().nextTree) &&
        void 0 !== _store$getState$nextT
          ? _store$getState$nextT
          : store.getState().currentTree,
      dependentNodes = (function (state, keys) {
        const dependentNodes = new Set(),
          visitedNodes = new Set(),
          visitingNodes = Array.from(keys);
        for (let key = visitingNodes.pop(); key; key = visitingNodes.pop()) {
          var _state$nodeToNodeSubs;
          dependentNodes.add(key), visitedNodes.add(key);
          const subscribedNodes =
            null !==
              (_state$nodeToNodeSubs = state.nodeToNodeSubscriptions.get(
                key,
              )) && void 0 !== _state$nodeToNodeSubs
              ? _state$nodeToNodeSubs
              : emptySet;
          for (const downstreamNode of subscribedNodes)
            visitedNodes.has(downstreamNode) ||
              visitingNodes.push(downstreamNode);
        }
        return dependentNodes;
      })(state, updatedNodes);
    for (const key of dependentNodes) {
      var _state$nodeToComponen;
      (null !==
        (_state$nodeToComponen = state.nodeToComponentSubscriptions.get(key)) &&
      void 0 !== _state$nodeToComponen
        ? _state$nodeToComponen
        : []
      ).forEach(([_debugName, cb]) => {
        'enqueue' === when
          ? store.getState().queuedComponentCallbacks.push(cb)
          : cb(state);
      });
    }
    Recoil_Tracing.trace(
      'value became available, waking components',
      Array.from(updatedNodes).join(', '),
      () => {
        const resolvers = store.getState().suspendedComponentResolvers;
        resolvers.forEach(r => r()), resolvers.clear();
      },
    );
  },
  detectCircularDependencies: function detectCircularDependencies(
    state,
    stack,
  ) {
    if (!stack.length) return;
    const leaf = stack[stack.length - 1],
      downstream = state.nodeToNodeSubscriptions.get(leaf);
    if (!(null == downstream ? void 0 : downstream.size)) return;
    const root = stack[0];
    if (downstream.has(root))
      throw new Error(
        'Recoil selector has circular dependencies: ' +
          [...stack, root].reverse().join(' → '),
      );
    for (const next of downstream)
      detectCircularDependencies(state, [...stack, next]);
  },
};
var Recoil_mapIterable = function (iterable, callback) {
  return (function* () {
    let index = 0;
    for (const value of iterable) yield callback(value, index++);
  })();
};
var Recoil_mapMap = function (map, callback) {
  const result = new Map();
  return (
    map.forEach((value, key) => {
      result.set(key, callback(value, key));
    }),
    result
  );
};
var Recoil_nullthrows = function (x, message) {
  if (null != x) return x;
  throw new Error(
    null != message ? message : 'Got unexpected null or undefined',
  );
};
const {
    getNodeLoadable: getNodeLoadable$1,
    peekNodeLoadable: peekNodeLoadable$1,
    setNodeValue: setNodeValue$1,
    setUnvalidatedAtomValue: setUnvalidatedAtomValue$1,
    subscribeComponentToNode: subscribeComponentToNode$1,
  } = Recoil_FunctionalCore,
  {RecoilValueNotReady: RecoilValueNotReady$1} = Recoil_Node,
  {
    AbstractRecoilValue: AbstractRecoilValue$1,
    RecoilState: RecoilState$1,
    RecoilValueReadOnly: RecoilValueReadOnly$1,
  } = require$$4;
var Recoil_RecoilValueInterface = {
  RecoilValueReadOnly: RecoilValueReadOnly$1,
  AbstractRecoilValue: AbstractRecoilValue$1,
  RecoilState: RecoilState$1,
  getRecoilValueAsLoadable: function (store, {key: key}) {
    let result;
    return (
      Recoil_Tracing.trace('get RecoilValue', key, () =>
        store.replaceState(
          Recoil_Tracing.wrap(state => {
            const [newState, loadable] = getNodeLoadable$1(store, state, key);
            return (result = loadable), newState;
          }),
        ),
      ),
      result
    );
  },
  setRecoilValue: function (store, recoilValue, valueOrUpdater) {
    const {key: key} = recoilValue;
    Recoil_Tracing.trace('set RecoilValue', key, () =>
      store.replaceState(
        Recoil_Tracing.wrap(state => {
          const newValue = (function (store, {key: key}, valueOrUpdater) {
              if ('function' == typeof valueOrUpdater) {
                var _storeState$nextTree;
                const storeState = store.getState(),
                  state =
                    null !== (_storeState$nextTree = storeState.nextTree) &&
                    void 0 !== _storeState$nextTree
                      ? _storeState$nextTree
                      : storeState.currentTree,
                  current = peekNodeLoadable$1(store, state, key);
                if ('loading' === current.state)
                  throw new RecoilValueNotReady$1(key);
                if ('hasError' === current.state) throw current.contents;
                return valueOrUpdater(current.contents);
              }
              return valueOrUpdater;
            })(store, recoilValue, valueOrUpdater),
            [newState, writtenNodes] = setNodeValue$1(
              store,
              state,
              key,
              newValue,
            );
          return store.fireNodeSubscriptions(writtenNodes, 'enqueue'), newState;
        }),
      ),
    );
  },
  setUnvalidatedRecoilValue: function (store, {key: key}, newValue) {
    Recoil_Tracing.trace('set unvalidated persisted atom', key, () =>
      store.replaceState(
        Recoil_Tracing.wrap(state => {
          const newState = setUnvalidatedAtomValue$1(state, key, newValue);
          return (
            store.fireNodeSubscriptions(new Set([key]), 'enqueue'), newState
          );
        }),
      ),
    );
  },
  subscribeToRecoilValue: function (store, {key: key}, callback) {
    let newState, releaseFn;
    return (
      Recoil_Tracing.trace('subscribe component to RecoilValue', key, () =>
        store.replaceState(
          Recoil_Tracing.wrap(
            state => (
              ([newState, releaseFn] = subscribeComponentToNode$1(
                state,
                key,
                callback,
              )),
              newState
            ),
          ),
        ),
      ),
      {release: store => store.replaceState(releaseFn)}
    );
  },
};
function makeEmptyTreeState() {
  return {
    transactionMetadata: {},
    dirtyAtoms: new Set(),
    atomValues: new Map(),
    nonvalidatedAtoms: new Map(),
    nodeDeps: new Map(),
    nodeToNodeSubscriptions: new Map(),
    nodeToComponentSubscriptions: new Map(),
  };
}
function makeStoreState(treeState) {
  return {
    currentTree: treeState,
    nextTree: null,
    knownAtoms: new Set(),
    knownSelectors: new Set(),
    transactionSubscriptions: new Map(),
    nodeTransactionSubscriptions: new Map(),
    queuedComponentCallbacks: [],
    suspendedComponentResolvers: new Set(),
  };
}
var Recoil_State = {
  makeEmptyTreeState: makeEmptyTreeState,
  makeEmptyStoreState: function () {
    return makeStoreState(makeEmptyTreeState());
  },
  makeStoreState: makeStoreState,
};
const {
    DEFAULT_VALUE: DEFAULT_VALUE$1,
    recoilValues: recoilValues$1,
  } = Recoil_Node,
  {
    getRecoilValueAsLoadable: getRecoilValueAsLoadable$1,
    setRecoilValue: setRecoilValue$1,
  } = Recoil_RecoilValueInterface,
  {
    makeEmptyTreeState: makeEmptyTreeState$1,
    makeStoreState: makeStoreState$1,
  } = Recoil_State;
class Snapshot {
  constructor(treeState) {
    _defineProperty(this, '_store', void 0),
      _defineProperty(this, 'getLoadable', recoilValue =>
        getRecoilValueAsLoadable$1(this._store, recoilValue),
      ),
      _defineProperty(this, 'getPromise', recoilValue =>
        this.getLoadable(recoilValue).toPromise(),
      ),
      _defineProperty(this, 'getNodes_UNSTABLE', opt => {
        if (!0 === (null == opt ? void 0 : opt.dirty)) {
          const state = this._store.getState().currentTree;
          return Recoil_mapIterable(state.dirtyAtoms, key =>
            Recoil_nullthrows(recoilValues$1.get(key)),
          );
        }
        return recoilValues$1.values();
      }),
      _defineProperty(this, 'getDeps_UNSTABLE', recoilValue => {
        this.getLoadable(recoilValue);
        const deps = this._store
          .getState()
          .currentTree.nodeDeps.get(recoilValue.key);
        return (function* () {
          for (const key of null != deps ? deps : [])
            yield Recoil_nullthrows(recoilValues$1.get(key));
        })();
      }),
      _defineProperty(this, 'map', mapper => {
        const mutableSnapshot = new MutableSnapshot(
          this._store.getState().currentTree,
        );
        mapper(mutableSnapshot);
        return cloneSnapshot(
          mutableSnapshot.getStore_INTERNAL().getState().currentTree,
        );
      }),
      _defineProperty(this, 'asyncMap', async mapper => {
        const mutableSnapshot = new MutableSnapshot(
          this._store.getState().currentTree,
        );
        await mapper(mutableSnapshot);
        return cloneSnapshot(
          mutableSnapshot.getStore_INTERNAL().getState().currentTree,
        );
      }),
      (this._store = (function (treeState) {
        const storeState = makeStoreState$1(treeState);
        return {
          getState: () => storeState,
          replaceState: replacer => {
            storeState.currentTree = replacer(storeState.currentTree);
          },
          subscribeToTransactions: () => ({release: () => {}}),
          addTransactionMetadata: () => {
            throw new Error('Cannot subscribe to Snapshots');
          },
          fireNodeSubscriptions: () => {},
        };
      })(treeState));
  }
  getStore_INTERNAL() {
    return this._store;
  }
}
function cloneTreeState(treeState) {
  return {
    transactionMetadata: {...treeState.transactionMetadata},
    dirtyAtoms: new Set(treeState.dirtyAtoms),
    atomValues: new Map(treeState.atomValues),
    nonvalidatedAtoms: new Map(treeState.nonvalidatedAtoms),
    nodeDeps: new Map(treeState.nodeDeps),
    nodeToNodeSubscriptions: Recoil_mapMap(
      treeState.nodeToNodeSubscriptions,
      keys => new Set(keys),
    ),
    nodeToComponentSubscriptions: new Map(),
  };
}
function cloneSnapshot(treeState) {
  return new Snapshot(cloneTreeState(treeState));
}
class MutableSnapshot extends Snapshot {
  constructor(treeState) {
    super(cloneTreeState(treeState)),
      _defineProperty(this, 'set', (recoilState, newValueOrUpdater) => {
        const store = this.getStore_INTERNAL();
        setRecoilValue$1(store, recoilState, newValueOrUpdater);
      }),
      _defineProperty(this, 'reset', recoilState =>
        setRecoilValue$1(
          this.getStore_INTERNAL(),
          recoilState,
          DEFAULT_VALUE$1,
        ),
      );
  }
}
var Recoil_Snapshot = {
    Snapshot: Snapshot,
    MutableSnapshot: MutableSnapshot,
    freshSnapshot: function () {
      return new Snapshot(makeEmptyTreeState$1());
    },
    cloneSnapshot: cloneSnapshot,
  },
  Recoil_Snapshot_1 = Recoil_Snapshot.Snapshot,
  Recoil_Snapshot_2 = Recoil_Snapshot.MutableSnapshot,
  Recoil_Snapshot_3 = Recoil_Snapshot.freshSnapshot,
  Recoil_Snapshot_4 = Recoil_Snapshot.cloneSnapshot,
  require$$4$1 = getCjsExportFromNamespace(
    Object.freeze({
      __proto__: null,
      Snapshot: Recoil_Snapshot_1,
      MutableSnapshot: Recoil_Snapshot_2,
      freshSnapshot: Recoil_Snapshot_3,
      cloneSnapshot: Recoil_Snapshot_4,
    }),
  );
const {
    useContext: useContext,
    useEffect: useEffect,
    useRef: useRef,
    useState: useState,
  } = react,
  {
    fireNodeSubscriptions: fireNodeSubscriptions$1,
    setNodeValue: setNodeValue$2,
    setUnvalidatedAtomValue: setUnvalidatedAtomValue$2,
  } = Recoil_FunctionalCore,
  {freshSnapshot: freshSnapshot$1} = require$$4$1,
  {
    makeEmptyStoreState: makeEmptyStoreState$1,
    makeStoreState: makeStoreState$2,
  } = Recoil_State;
function notInAContext() {
  throw new Error(
    'This component must be used inside a <RecoilRoot> component.',
  );
}
const defaultStore = Object.freeze({
  getState: notInAContext,
  replaceState: notInAContext,
  subscribeToTransactions: notInAContext,
  addTransactionMetadata: notInAContext,
  fireNodeSubscriptions: notInAContext,
});
function startNextTreeIfNeeded(storeState) {
  null === storeState.nextTree &&
    (storeState.nextTree = {
      ...storeState.currentTree,
      dirtyAtoms: new Set(),
      transactionMetadata: {},
    });
}
const AppContext = react.createContext({current: defaultStore}),
  useStoreRef = () => useContext(AppContext);
function Batcher(props) {
  const storeRef = useStoreRef(),
    [_, setState] = useState([]);
  return (
    props.setNotifyBatcherOfChange(() => setState({})),
    useEffect(() => {
      Recoil_Queue.enqueueExecution('Batcher', () => {
        const storeState = storeRef.current.getState(),
          {nextTree: nextTree} = storeState;
        if (null === nextTree) return;
        const dirtyAtoms = nextTree.dirtyAtoms;
        if (dirtyAtoms.size) {
          for (const [
            key,
            subscriptions,
          ] of storeState.nodeTransactionSubscriptions)
            if (dirtyAtoms.has(key))
              for (const subscription of subscriptions)
                subscription(storeRef.current);
          for (const [_, subscription] of storeState.transactionSubscriptions)
            subscription(storeRef.current);
        }
        storeState.queuedComponentCallbacks.forEach(cb => cb(nextTree)),
          storeState.queuedComponentCallbacks.splice(
            0,
            storeState.queuedComponentCallbacks.length,
          ),
          (storeState.currentTree = nextTree),
          (storeState.nextTree = null);
      });
    }),
    null
  );
}
let nextID = 0;
var Recoil_RecoilRoot_react = {
  useStoreRef: useStoreRef,
  RecoilRoot: function ({
    initializeState_DEPRECATED: initializeState_DEPRECATED,
    initializeState: initializeState,
    children: children,
  }) {
    let storeState;
    const notifyBatcherOfChange = useRef(null),
      store = {
        getState: () => storeState.current,
        replaceState: replacer => {
          const storeState = storeRef.current.getState();
          startNextTreeIfNeeded(storeState);
          const nextTree = Recoil_nullthrows(storeState.nextTree),
            replaced = replacer(nextTree);
          replaced !== nextTree &&
            ((storeState.nextTree = replaced),
            Recoil_nullthrows(notifyBatcherOfChange.current)());
        },
        subscribeToTransactions: (callback, key) => {
          if (null == key) {
            const {
                transactionSubscriptions: transactionSubscriptions,
              } = storeRef.current.getState(),
              id = nextID++;
            return (
              transactionSubscriptions.set(id, callback),
              {
                release: () => {
                  transactionSubscriptions.delete(id);
                },
              }
            );
          }
          {
            const {
              nodeTransactionSubscriptions: nodeTransactionSubscriptions,
            } = storeRef.current.getState();
            return (
              nodeTransactionSubscriptions.has(key) ||
                nodeTransactionSubscriptions.set(key, []),
              Recoil_nullthrows(nodeTransactionSubscriptions.get(key)).push(
                callback,
              ),
              {release: () => {}}
            );
          }
        },
        addTransactionMetadata: metadata => {
          startNextTreeIfNeeded(storeRef.current.getState());
          for (const k of Object.keys(metadata))
            Recoil_nullthrows(
              storeRef.current.getState().nextTree,
            ).transactionMetadata[k] = metadata[k];
        },
        fireNodeSubscriptions: function (updatedNodes, when) {
          fireNodeSubscriptions$1(storeRef.current, updatedNodes, when);
        },
      },
      storeRef = useRef(store);
    return (
      (storeState = useRef(
        null != initializeState_DEPRECATED
          ? (function (store, initializeState) {
              const initial = makeEmptyStoreState$1();
              return (
                initializeState({
                  set: (atom, value) => {
                    initial.currentTree = setNodeValue$2(
                      store,
                      initial.currentTree,
                      atom.key,
                      value,
                    )[0];
                  },
                  setUnvalidatedAtomValues: atomValues => {
                    atomValues.forEach((v, k) => {
                      initial.currentTree = setUnvalidatedAtomValue$2(
                        initial.currentTree,
                        k,
                        v,
                      );
                    });
                  },
                }),
                initial
              );
            })(store, initializeState_DEPRECATED)
          : null != initializeState
          ? (function (initializeState) {
              const snapshot = freshSnapshot$1().map(initializeState);
              return makeStoreState$2(
                snapshot.getStore_INTERNAL().getState().currentTree,
              );
            })(initializeState)
          : makeEmptyStoreState$1(),
      )),
      react.createElement(
        AppContext.Provider,
        {value: storeRef},
        react.createElement(Batcher, {
          setNotifyBatcherOfChange: function (x) {
            notifyBatcherOfChange.current = x;
          },
        }),
        children,
      )
    );
  },
};
var Recoil_differenceSets = function (set, ...setsWithValuesToRemove) {
  const ret = new Set();
  FIRST: for (const value of set) {
    for (const otherSet of setsWithValuesToRemove)
      if (otherSet.has(value)) continue FIRST;
    ret.add(value);
  }
  return ret;
};
var Recoil_filterMap = function (map, callback) {
  const result = new Map();
  for (const [key, value] of map)
    callback(value, key) && result.set(key, value);
  return result;
};
var Recoil_invariant = function (condition, message) {
  if (!condition) throw new Error(message);
};
var Recoil_mergeMaps = function (...maps) {
  const result = new Map();
  for (let i = 0; i < maps.length; i++) {
    const iterator = maps[i].keys();
    let nextKey;
    for (; !(nextKey = iterator.next()).done; )
      result.set(nextKey.value, maps[i].get(nextKey.value));
  }
  return result;
};
const {
    useCallback: useCallback,
    useEffect: useEffect$1,
    useMemo: useMemo,
    useRef: useRef$1,
    useState: useState$1,
  } = react,
  {
    DEFAULT_VALUE: DEFAULT_VALUE$2,
    getNode: getNode$2,
    nodes: nodes$1,
  } = Recoil_Node,
  {useStoreRef: useStoreRef$1} = Recoil_RecoilRoot_react,
  {
    AbstractRecoilValue: AbstractRecoilValue$2,
    getRecoilValueAsLoadable: getRecoilValueAsLoadable$2,
    setRecoilValue: setRecoilValue$2,
    setUnvalidatedRecoilValue: setUnvalidatedRecoilValue$1,
    subscribeToRecoilValue: subscribeToRecoilValue$1,
  } = Recoil_RecoilValueInterface,
  {Snapshot: Snapshot$1, cloneSnapshot: cloneSnapshot$1} = require$$4$1,
  {setByAddingToSet: setByAddingToSet$2} = Recoil_CopyOnWrite,
  {batchUpdates: batchUpdates$1} = Recoil_batch;
function useInterface() {
  const storeRef = useStoreRef$1(),
    [_, forceUpdate] = useState$1([]),
    recoilValuesUsed = useRef$1(new Set());
  recoilValuesUsed.current = new Set();
  const previousSubscriptions = useRef$1(new Set()),
    subscriptions = useRef$1(new Map()),
    unsubscribeFrom = useCallback(
      key => {
        const sub = subscriptions.current.get(key);
        sub &&
          (sub.release(storeRef.current), subscriptions.current.delete(key));
      },
      [storeRef, subscriptions],
    );
  return (
    useEffect$1(() => {
      const store = storeRef.current;
      function updateState(_state, key) {
        subscriptions.current.has(key) && forceUpdate([]);
      }
      Recoil_differenceSets(
        recoilValuesUsed.current,
        previousSubscriptions.current,
      ).forEach(key => {
        if (subscriptions.current.has(key)) return;
        const sub = subscribeToRecoilValue$1(
          store,
          new AbstractRecoilValue$2(key),
          state => {
            Recoil_Tracing.trace('RecoilValue subscription fired', key, () => {
              updateState(0, key);
            });
          },
        );
        subscriptions.current.set(key, sub),
          Recoil_Tracing.trace('initial update on subscribing', key, () => {
            updateState(store.getState(), key);
          });
      }),
        Recoil_differenceSets(
          previousSubscriptions.current,
          recoilValuesUsed.current,
        ).forEach(key => {
          unsubscribeFrom(key);
        }),
        (previousSubscriptions.current = recoilValuesUsed.current);
    }),
    useEffect$1(() => {
      const subs = subscriptions.current;
      return () => subs.forEach((_, key) => unsubscribeFrom(key));
    }, [unsubscribeFrom]),
    useMemo(() => {
      function useSetRecoilState(recoilState) {
        return newValueOrUpdater => {
          setRecoilValue$2(storeRef.current, recoilState, newValueOrUpdater);
        };
      }
      function useRecoilValueLoadable(recoilValue) {
        return (
          recoilValuesUsed.current.has(recoilValue.key) ||
            (recoilValuesUsed.current = setByAddingToSet$2(
              recoilValuesUsed.current,
              recoilValue.key,
            )),
          getRecoilValueAsLoadable$2(storeRef.current, recoilValue)
        );
      }
      function useRecoilValue(recoilValue) {
        return (function (loadable, atom, storeRef) {
          if ('hasValue' === loadable.state) return loadable.contents;
          if ('loading' === loadable.state) {
            throw new Promise(resolve => {
              storeRef.current
                .getState()
                .suspendedComponentResolvers.add(resolve);
            });
          }
          throw 'hasError' === loadable.state
            ? loadable.contents
            : new Error(`Invalid value of loadable atom "${atom.key}"`);
        })(useRecoilValueLoadable(recoilValue), recoilValue, storeRef);
      }
      return {
        getRecoilValue: useRecoilValue,
        getRecoilValueLoadable: useRecoilValueLoadable,
        getRecoilState: function (recoilState) {
          return [useRecoilValue(recoilState), useSetRecoilState(recoilState)];
        },
        getRecoilStateLoadable: function (recoilState) {
          return [
            useRecoilValueLoadable(recoilState),
            useSetRecoilState(recoilState),
          ];
        },
        getSetRecoilState: useSetRecoilState,
        getResetRecoilState: function (recoilState) {
          return () =>
            setRecoilValue$2(storeRef.current, recoilState, DEFAULT_VALUE$2);
        },
      };
    }, [recoilValuesUsed, storeRef])
  );
}
function useTransactionSubscription(callback) {
  const storeRef = useStoreRef$1();
  useEffect$1(
    () => storeRef.current.subscribeToTransactions(callback).release,
    [callback, storeRef],
  );
}
function externallyVisibleAtomValuesInState(state) {
  const atomValues = state.atomValues,
    persistedAtomContentsValues = Recoil_mapMap(
      Recoil_filterMap(atomValues, (v, k) => {
        var _node$options;
        const persistence =
          null === (_node$options = getNode$2(k).options) ||
          void 0 === _node$options
            ? void 0
            : _node$options.persistence_UNSTABLE;
        return (
          null != persistence &&
          'none' !== persistence.type &&
          'hasValue' === v.state
        );
      }),
      v => v.contents,
    );
  return Recoil_mergeMaps(state.nonvalidatedAtoms, persistedAtomContentsValues);
}
function useGotoRecoilSnapshot() {
  const storeRef = useStoreRef$1();
  return useCallback(
    snapshot => {
      batchUpdates$1(() => {
        storeRef.current.replaceState(prevState => {
          const nextState = snapshot.getStore_INTERNAL().getState().currentTree,
            updatedKeys = new Set();
          for (const keys of [
            prevState.atomValues.keys(),
            nextState.atomValues.keys(),
          ])
            for (const key of keys) {
              var _prevState$atomValues, _nextState$atomValues;
              (null ===
                (_prevState$atomValues = prevState.atomValues.get(key)) ||
              void 0 === _prevState$atomValues
                ? void 0
                : _prevState$atomValues.contents) !==
                (null ===
                  (_nextState$atomValues = nextState.atomValues.get(key)) ||
                void 0 === _nextState$atomValues
                  ? void 0
                  : _nextState$atomValues.contents) && updatedKeys.add(key);
            }
          return (
            storeRef.current.fireNodeSubscriptions(updatedKeys, 'enqueue'),
            {
              ...nextState,
              nodeToComponentSubscriptions:
                prevState.nodeToComponentSubscriptions,
            }
          );
        });
      });
    },
    [storeRef],
  );
}
class Sentinel {}
const SENTINEL = new Sentinel();
var Recoil_Hooks = {
  useRecoilCallback: function (fn, deps) {
    const storeRef = useStoreRef$1(),
      gotoSnapshot = useGotoRecoilSnapshot();
    return useCallback(
      (...args) => {
        const snapshot = cloneSnapshot$1(
          storeRef.current.getState().currentTree,
        );
        function set(recoilState, newValueOrUpdater) {
          setRecoilValue$2(storeRef.current, recoilState, newValueOrUpdater);
        }
        function reset(recoilState) {
          setRecoilValue$2(storeRef.current, recoilState, DEFAULT_VALUE$2);
        }
        let ret = SENTINEL;
        return (
          batchUpdates$1(() => {
            ret = fn({
              set: set,
              reset: reset,
              snapshot: snapshot,
              gotoSnapshot: gotoSnapshot,
            })(...args);
          }),
          ret instanceof Sentinel && Recoil_invariant(!1),
          ret
        );
      },
      null != deps ? [...deps, storeRef] : void 0,
    );
  },
  useRecoilValue: function (recoilValue) {
    return useInterface().getRecoilValue(recoilValue);
  },
  useRecoilValueLoadable: function (recoilValue) {
    return useInterface().getRecoilValueLoadable(recoilValue);
  },
  useRecoilState: function (recoilState) {
    const recoilInterface = useInterface(),
      [value] = recoilInterface.getRecoilState(recoilState);
    return [
      value,
      useCallback(recoilInterface.getSetRecoilState(recoilState), [
        recoilState,
      ]),
    ];
  },
  useRecoilStateLoadable: function (recoilState) {
    const recoilInterface = useInterface(),
      [value] = recoilInterface.getRecoilStateLoadable(recoilState);
    return [
      value,
      useCallback(recoilInterface.getSetRecoilState(recoilState), [
        recoilState,
      ]),
    ];
  },
  useSetRecoilState: function (recoilState) {
    return useCallback(useInterface().getSetRecoilState(recoilState), [
      recoilState,
    ]);
  },
  useResetRecoilState: function (recoilState) {
    return useCallback(useInterface().getResetRecoilState(recoilState), [
      recoilState,
    ]);
  },
  useRecoilInterface: useInterface,
  useTransactionSubscription_DEPRECATED: useTransactionSubscription,
  useTransactionObservation_DEPRECATED: function (callback) {
    useTransactionSubscription(
      useCallback(
        store => {
          const previousState = store.getState().currentTree;
          let nextState = store.getState().nextTree;
          nextState || (nextState = store.getState().currentTree);
          const atomValues = externallyVisibleAtomValuesInState(nextState),
            previousAtomValues = externallyVisibleAtomValuesInState(
              previousState,
            ),
            atomInfo = Recoil_mapMap(nodes$1, node => {
              var _node$options$persist,
                _node$options2,
                _node$options2$persis,
                _node$options$persist2,
                _node$options3,
                _node$options3$persis;
              return {
                persistence_UNSTABLE: {
                  type:
                    null !==
                      (_node$options$persist =
                        null === (_node$options2 = node.options) ||
                        void 0 === _node$options2 ||
                        null ===
                          (_node$options2$persis =
                            _node$options2.persistence_UNSTABLE) ||
                        void 0 === _node$options2$persis
                          ? void 0
                          : _node$options2$persis.type) &&
                    void 0 !== _node$options$persist
                      ? _node$options$persist
                      : 'none',
                  backButton:
                    null !==
                      (_node$options$persist2 =
                        null === (_node$options3 = node.options) ||
                        void 0 === _node$options3 ||
                        null ===
                          (_node$options3$persis =
                            _node$options3.persistence_UNSTABLE) ||
                        void 0 === _node$options3$persis
                          ? void 0
                          : _node$options3$persis.backButton) &&
                    void 0 !== _node$options$persist2 &&
                    _node$options$persist2,
                },
              };
            }),
            modifiedAtoms = new Set(nextState.dirtyAtoms);
          callback({
            atomValues: atomValues,
            previousAtomValues: previousAtomValues,
            atomInfo: atomInfo,
            modifiedAtoms: modifiedAtoms,
            transactionMetadata: {...nextState.transactionMetadata},
          });
        },
        [callback],
      ),
    );
  },
  useRecoilTransactionObserver: function (callback) {
    useTransactionSubscription(
      useCallback(
        store => {
          const previousState = store.getState().currentTree;
          let nextState = store.getState().nextTree;
          nextState || (nextState = previousState),
            callback({
              snapshot: cloneSnapshot$1(nextState),
              previousSnapshot: cloneSnapshot$1(previousState),
            });
        },
        [callback],
      ),
    );
  },
  useRecoilSnapshot: function () {
    const store = useStoreRef$1(),
      [snapshot, setSnapshot] = useState$1(() =>
        cloneSnapshot$1(store.current.getState().currentTree),
      );
    return (
      useTransactionSubscription(
        useCallback(store => {
          var _store$getState$nextT;
          return setSnapshot(
            cloneSnapshot$1(
              null !== (_store$getState$nextT = store.getState().nextTree) &&
                void 0 !== _store$getState$nextT
                ? _store$getState$nextT
                : store.getState().currentTree,
            ),
          );
        }, []),
      ),
      snapshot
    );
  },
  useGotoRecoilSnapshot: useGotoRecoilSnapshot,
  useSetUnvalidatedAtomValues: function () {
    const storeRef = useStoreRef$1();
    return (values, transactionMetadata = {}) => {
      batchUpdates$1(() => {
        storeRef.current.addTransactionMetadata(transactionMetadata),
          values.forEach((value, key) =>
            setUnvalidatedRecoilValue$1(
              storeRef.current,
              new AbstractRecoilValue$2(key),
              value,
            ),
          );
      });
    };
  },
};
var Recoil_isPromise = function (p) {
  return !!p && 'function' == typeof p.then;
};
const loadableAccessors = {
  getValue() {
    if ('hasValue' !== this.state) throw this.contents;
    return this.contents;
  },
  toPromise() {
    return 'hasValue' === this.state
      ? Promise.resolve(this.contents)
      : 'hasError' === this.state
      ? Promise.reject(this.contents)
      : this.contents;
  },
  valueMaybe() {
    return 'hasValue' === this.state ? this.contents : void 0;
  },
  valueOrThrow() {
    if ('hasValue' !== this.state)
      throw new Error(`Loadable expected value, but in "${this.state}" state`);
    return this.contents;
  },
  errorMaybe() {
    return 'hasError' === this.state ? this.contents : void 0;
  },
  errorOrThrow() {
    if ('hasError' !== this.state)
      throw new Error(`Loadable expected error, but in "${this.state}" state`);
    return this.contents;
  },
  promiseMaybe() {
    return 'loading' === this.state ? this.contents : void 0;
  },
  promiseOrThrow() {
    if ('loading' !== this.state)
      throw new Error(
        `Loadable expected promise, but in "${this.state}" state`,
      );
    return this.contents;
  },
  map(map) {
    if ('hasError' === this.state) return this;
    if ('hasValue' === this.state)
      try {
        const next = map(this.contents);
        return Recoil_isPromise(next)
          ? loadableWithPromise(next)
          : loadableWithValue(next);
      } catch (e) {
        return Recoil_isPromise(e)
          ? loadableWithPromise(e.next(() => map(this.contents)))
          : loadableWithError(e);
      }
    if ('loading' === this.state)
      return loadableWithPromise(
        this.contents.then(map).catch(e => {
          if (Recoil_isPromise(e)) return e.then(() => map(this.contents));
          throw e;
        }),
      );
    throw new Error('Invalid Loadable state');
  },
};
function loadableWithValue(value) {
  return Object.freeze({
    state: 'hasValue',
    contents: value,
    ...loadableAccessors,
  });
}
function loadableWithError(error) {
  return Object.freeze({
    state: 'hasError',
    contents: error,
    ...loadableAccessors,
  });
}
function loadableWithPromise(promise) {
  return Object.freeze({
    state: 'loading',
    contents: promise,
    ...loadableAccessors,
  });
}
var Recoil_Loadable = {
  loadableWithValue: loadableWithValue,
  loadableWithError: loadableWithError,
  loadableWithPromise: loadableWithPromise,
  loadableLoading: function () {
    return loadableWithPromise(new Promise(() => {}));
  },
  loadableAll: function (inputs) {
    return inputs.every(i => 'hasValue' === i.state)
      ? loadableWithValue(inputs.map(i => i.contents))
      : inputs.some(i => 'hasError' === i.state)
      ? loadableWithError(
          Recoil_nullthrows(
            inputs.find(i => 'hasError' === i.state),
            'Invalid loadable passed to loadableAll',
          ).contents,
        )
      : loadableWithPromise(Promise.all(inputs.map(i => i.contents)));
  },
};
const LEAF = Symbol('ArrayKeyedMap'),
  emptyMap$1 = new Map();
class ArrayKeyedMap {
  constructor(existing) {
    if (((this._base = new Map()), existing instanceof ArrayKeyedMap))
      for (const [k, v] of existing.entries()) this.set(k, v);
    else if (existing) for (const [k, v] of existing) this.set(k, v);
    return this;
  }
  get(key) {
    const ks = Array.isArray(key) ? key : [key];
    let map = this._base;
    return (
      ks.forEach(k => {
        var _map$get;
        map =
          null !== (_map$get = map.get(k)) && void 0 !== _map$get
            ? _map$get
            : emptyMap$1;
      }),
      void 0 === map ? void 0 : map.get(LEAF)
    );
  }
  set(key, value) {
    const ks = Array.isArray(key) ? key : [key];
    let map = this._base,
      next = map;
    return (
      ks.forEach(k => {
        (next = map.get(k)),
          next || ((next = new Map()), map.set(k, next)),
          (map = next);
      }),
      next.set(LEAF, value),
      this
    );
  }
  delete(key) {
    const ks = Array.isArray(key) ? key : [key];
    let map = this._base,
      next = map;
    return (
      ks.forEach(k => {
        (next = map.get(k)),
          next || ((next = new Map()), map.set(k, next)),
          (map = next);
      }),
      next.delete(LEAF),
      this
    );
  }
  entries() {
    const answer = [];
    return (
      (function recurse(level, prefix) {
        level.forEach((v, k) => {
          k === LEAF ? answer.push([prefix, v]) : recurse(v, prefix.concat(k));
        });
      })(this._base, []),
      answer.values()
    );
  }
  toBuiltInMap() {
    return new Map(this.entries());
  }
}
var Recoil_ArrayKeyedMap = ArrayKeyedMap;
var Recoil_cacheWithReferenceEquality = function () {
  return new Recoil_ArrayKeyedMap();
};
var Recoil_everySet = function (set, callback, context) {
  const iterator = set.entries();
  let current = iterator.next();
  for (; !current.done; ) {
    const entry = current.value;
    if (!callback.call(context, entry[1], entry[0], set)) return !1;
    current = iterator.next();
  }
  return !0;
};
var Recoil_equalsSet = function (one, two) {
  return one.size === two.size && Recoil_everySet(one, value => two.has(value));
};
var Recoil_PerformanceTimings = {
  startPerfBlock: function (_id) {
    return () => null;
  },
};
Object.freeze(new Set());
const {
    loadableWithError: loadableWithError$1,
    loadableWithPromise: loadableWithPromise$1,
    loadableWithValue: loadableWithValue$1,
  } = Recoil_Loadable,
  {
    detectCircularDependencies: detectCircularDependencies$1,
    getNodeLoadable: getNodeLoadable$2,
    setNodeValue: setNodeValue$3,
  } = Recoil_FunctionalCore,
  {
    DEFAULT_VALUE: DEFAULT_VALUE$3,
    RecoilValueNotReady: RecoilValueNotReady$2,
    registerNode: registerNode$1,
  } = Recoil_Node,
  {isRecoilValue: isRecoilValue$1} = require$$4,
  {
    mapBySettingInMap: mapBySettingInMap$2,
    mapByUpdatingInMap: mapByUpdatingInMap$2,
    setByAddingToSet: setByAddingToSet$3,
    setByDeletingFromSet: setByDeletingFromSet$1,
  } = Recoil_CopyOnWrite,
  {startPerfBlock: startPerfBlock$1} = Recoil_PerformanceTimings,
  emptySet$2 = Object.freeze(new Set());
function cacheKeyFromDepValues(depValues) {
  const answer = [];
  for (const key of Array.from(depValues.keys()).sort()) {
    const loadable = Recoil_nullthrows(depValues.get(key));
    answer.push(key), answer.push(loadable.contents);
  }
  return answer;
}
var Recoil_selector = function (options) {
  const {
      key: key,
      get: get,
      cacheImplementation_UNSTABLE: cacheImplementation,
    } = options,
    set = null != options.set ? options.set : void 0;
  let cache =
    null != cacheImplementation
      ? cacheImplementation
      : Recoil_cacheWithReferenceEquality();
  function initSelector(store) {
    store.getState().knownSelectors.add(key);
  }
  function getFromCache(store, state) {
    var _state$nodeDeps$get;
    let newState = state;
    const currentDeps =
        null !== (_state$nodeDeps$get = state.nodeDeps.get(key)) &&
        void 0 !== _state$nodeDeps$get
          ? _state$nodeDeps$get
          : emptySet$2,
      cacheKey = cacheKeyFromDepValues(
        new Map(
          Array.from(currentDeps)
            .sort()
            .map(depKey => {
              const [nextState, loadable] = getNodeLoadable$2(
                store,
                newState,
                depKey,
              );
              return (newState = nextState), [depKey, loadable];
            }),
        ),
      ),
      cached = cache.get(cacheKey);
    if (null != cached) return [newState, cached];
    const [nextState, loadable, newDepValues] = (function (store, state) {
      var _state$nodeDeps$get2;
      const [newStateFromEvaluate, loadable, newDepValues] = (function (
        store,
        state,
      ) {
        const endPerfBlock = startPerfBlock$1(key);
        let newState = state;
        const depValues = new Map();
        function getRecoilValue({key: key}) {
          let loadable;
          if (
            (([newState, loadable] = getNodeLoadable$2(store, newState, key)),
            depValues.set(key, loadable),
            'hasValue' === loadable.state)
          )
            return loadable.contents;
          throw loadable.contents;
        }
        try {
          const output = get({get: getRecoilValue}),
            result = isRecoilValue$1(output) ? getRecoilValue(output) : output,
            loadable = Recoil_isPromise(result)
              ? loadableWithPromise$1(result.finally(endPerfBlock))
              : (endPerfBlock(), loadableWithValue$1(result));
          return [newState, loadable, depValues];
        } catch (errorOrDepPromise) {
          const loadable = Recoil_isPromise(errorOrDepPromise)
            ? loadableWithPromise$1(
                errorOrDepPromise
                  .then(() => {
                    let loadable = loadableWithError$1(
                      new Error('Internal Recoil Selector Error'),
                    );
                    if (
                      (store.replaceState(asyncState => {
                        let newAsyncState;
                        return (
                          ([newAsyncState, loadable] = getFromCache(
                            store,
                            asyncState,
                          )),
                          newAsyncState
                        );
                      }),
                      'hasError' === loadable.state)
                    )
                      throw loadable.contents;
                    return loadable.contents;
                  })
                  .finally(endPerfBlock),
              )
            : (endPerfBlock(), loadableWithError$1(errorOrDepPromise));
          return [newState, loadable, depValues];
        }
      })(store, state);
      let newState = newStateFromEvaluate;
      const oldDeps =
          null !== (_state$nodeDeps$get2 = state.nodeDeps.get(key)) &&
          void 0 !== _state$nodeDeps$get2
            ? _state$nodeDeps$get2
            : emptySet$2,
        newDeps = new Set(newDepValues.keys());
      newState = Recoil_equalsSet(oldDeps, newDeps)
        ? newState
        : {
            ...newState,
            nodeDeps: mapBySettingInMap$2(newState.nodeDeps, key, newDeps),
          };
      const addedDeps = Recoil_differenceSets(newDeps, oldDeps),
        removedDeps = Recoil_differenceSets(oldDeps, newDeps);
      for (const upstreamNode of addedDeps)
        newState = {
          ...newState,
          nodeToNodeSubscriptions: mapByUpdatingInMap$2(
            newState.nodeToNodeSubscriptions,
            upstreamNode,
            subs => setByAddingToSet$3(null != subs ? subs : emptySet$2, key),
          ),
        };
      for (const upstreamNode of removedDeps)
        newState = {
          ...newState,
          nodeToNodeSubscriptions: mapByUpdatingInMap$2(
            newState.nodeToNodeSubscriptions,
            upstreamNode,
            subs =>
              setByDeletingFromSet$1(null != subs ? subs : emptySet$2, key),
          ),
        };
      return [newState, loadable, newDepValues];
    })(store, newState);
    newState = nextState;
    const newCacheKey = cacheKeyFromDepValues(newDepValues);
    return (
      (function (store, cacheKey, loadable) {
        'loading' !== loadable.state ||
          loadable.contents
            .then(
              result => (
                (cache = cache.set(cacheKey, loadableWithValue$1(result))),
                store.fireNodeSubscriptions(new Set([key]), 'now'),
                result
              ),
            )
            .catch(
              error => (
                Recoil_isPromise(error) ||
                  ((cache = cache.set(cacheKey, loadableWithError$1(error))),
                  store.fireNodeSubscriptions(new Set([key]), 'now')),
                error
              ),
            ),
          (cache = cache.set(cacheKey, loadable));
      })(store, newCacheKey, loadable),
      [newState, loadable]
    );
  }
  function myGet(store, state) {
    return initSelector(store), getFromCache(store, state);
  }
  if (null != set) {
    return registerNode$1({
      key: key,
      options: options,
      get: myGet,
      set: function (store, state, newValue) {
        initSelector(store);
        let newState = state;
        const writtenNodes = new Set();
        function getRecoilValue({key: key}) {
          const [nextState, loadable] = getNodeLoadable$2(store, newState, key);
          if (((newState = nextState), 'hasValue' === loadable.state))
            return loadable.contents;
          throw 'loading' === loadable.state
            ? new RecoilValueNotReady$2(key)
            : loadable.contents;
        }
        function setRecoilState(recoilState, valueOrUpdater) {
          const newValue =
            'function' == typeof valueOrUpdater
              ? valueOrUpdater(getRecoilValue(recoilState))
              : valueOrUpdater;
          let written;
          ([newState, written] = setNodeValue$3(
            store,
            newState,
            recoilState.key,
            newValue,
          )),
            written.forEach(atom => writtenNodes.add(atom));
        }
        return (
          set(
            {
              set: setRecoilState,
              get: getRecoilValue,
              reset: function (recoilState) {
                setRecoilState(recoilState, DEFAULT_VALUE$3);
              },
            },
            newValue,
          ),
          [newState, writtenNodes]
        );
      },
    });
  }
  return registerNode$1({key: key, options: options, get: myGet});
};
const {loadableWithValue: loadableWithValue$2} = Recoil_Loadable,
  {
    DEFAULT_VALUE: DEFAULT_VALUE$4,
    DefaultValue: DefaultValue$1,
    registerNode: registerNode$2,
  } = Recoil_Node,
  {isRecoilValue: isRecoilValue$2} = require$$4,
  {setRecoilValue: setRecoilValue$3} = Recoil_RecoilValueInterface,
  {cloneSnapshot: cloneSnapshot$2} = require$$4$1,
  {
    mapByDeletingFromMap: mapByDeletingFromMap$2,
    mapBySettingInMap: mapBySettingInMap$3,
    setByAddingToSet: setByAddingToSet$4,
  } = Recoil_CopyOnWrite;
function atom(options) {
  const {default: optionsDefault, ...restOptions} = options;
  return isRecoilValue$2(optionsDefault) || Recoil_isPromise(optionsDefault)
    ? (function (options) {
        const base = atom({
          ...options,
          default: DEFAULT_VALUE$4,
          persistence_UNSTABLE:
            void 0 === options.persistence_UNSTABLE
              ? void 0
              : {
                  ...options.persistence_UNSTABLE,
                  validator: storedValue =>
                    storedValue instanceof DefaultValue$1
                      ? storedValue
                      : Recoil_nullthrows(
                          options.persistence_UNSTABLE,
                        ).validator(storedValue, DEFAULT_VALUE$4),
                },
          effects_UNSTABLE: options.effects_UNSTABLE,
        });
        return Recoil_selector({
          key: options.key + '__withFallback',
          get: ({get: get}) => {
            const baseValue = get(base);
            return baseValue instanceof DefaultValue$1
              ? options.default
              : baseValue;
          },
          set: ({set: set}, newValue) => set(base, newValue),
          dangerouslyAllowMutability: options.dangerouslyAllowMutability,
        });
      })({...restOptions, default: optionsDefault})
    : (function (options) {
        const {key: key, persistence_UNSTABLE: persistence} = options;
        function initAtom(store, initState, trigger) {
          if (store.getState().knownAtoms.has(key)) return;
          store.getState().knownAtoms.add(key);
          let initValue = DEFAULT_VALUE$4;
          if (null != options.effects_UNSTABLE) {
            let duringInit = !0;
            function getSnapshot() {
              var _store$getState$nextT;
              return cloneSnapshot$2(
                duringInit
                  ? initState
                  : null !==
                      (_store$getState$nextT = store.getState().nextTree) &&
                    void 0 !== _store$getState$nextT
                  ? _store$getState$nextT
                  : store.getState().currentTree,
              );
            }
            function setSelf(valueOrUpdater) {
              if (duringInit) {
                const currentValue =
                  initValue instanceof DefaultValue$1
                    ? options.default
                    : initValue;
                initValue =
                  'function' == typeof valueOrUpdater
                    ? valueOrUpdater(currentValue)
                    : valueOrUpdater;
              } else setRecoilValue$3(store, node, valueOrUpdater);
            }
            const resetSelf = () => setSelf(DEFAULT_VALUE$4);
            function onSet(handler) {
              store.subscribeToTransactions(asyncStore => {
                var _state$nextTree;
                const state = asyncStore.getState(),
                  nextState =
                    null !== (_state$nextTree = state.nextTree) &&
                    void 0 !== _state$nextTree
                      ? _state$nextTree
                      : state.currentTree,
                  prevState = state.currentTree,
                  newValue = nextState.atomValues.has(key)
                    ? Recoil_nullthrows(
                        nextState.atomValues.get(key),
                      ).valueOrThrow()
                    : DEFAULT_VALUE$4,
                  oldValue = prevState.atomValues.has(key)
                    ? Recoil_nullthrows(
                        prevState.atomValues.get(key),
                      ).valueOrThrow()
                    : DEFAULT_VALUE$4;
                handler(newValue, oldValue);
              }, key);
            }
            for (const effect of null !==
              (_options$effects_UNST = options.effects_UNSTABLE) &&
            void 0 !== _options$effects_UNST
              ? _options$effects_UNST
              : []) {
              var _options$effects_UNST;
              effect({
                node: node,
                trigger: trigger,
                setSelf: setSelf,
                resetSelf: resetSelf,
                getSnapshot: getSnapshot,
                onSet: onSet,
              });
            }
            duringInit = !1;
          }
          initValue instanceof DefaultValue$1 ||
            initState.atomValues.set(key, loadableWithValue$2(initValue));
        }
        const node = registerNode$2({
          key: key,
          options: options,
          get: function (store, state) {
            if ((initAtom(store, state, 'get'), state.atomValues.has(key)))
              return [state, Recoil_nullthrows(state.atomValues.get(key))];
            if (state.nonvalidatedAtoms.has(key)) {
              if (null == persistence)
                return [state, loadableWithValue$2(options.default)];
              const nonvalidatedValue = state.nonvalidatedAtoms.get(key),
                validatedValue = persistence.validator(
                  nonvalidatedValue,
                  DEFAULT_VALUE$4,
                );
              return validatedValue instanceof DefaultValue$1
                ? [
                    {
                      ...state,
                      nonvalidatedAtoms: mapByDeletingFromMap$2(
                        state.nonvalidatedAtoms,
                        key,
                      ),
                    },
                    loadableWithValue$2(options.default),
                  ]
                : [
                    {
                      ...state,
                      atomValues: mapBySettingInMap$3(
                        state.atomValues,
                        key,
                        loadableWithValue$2(validatedValue),
                      ),
                      nonvalidatedAtoms: mapByDeletingFromMap$2(
                        state.nonvalidatedAtoms,
                        key,
                      ),
                    },
                    loadableWithValue$2(validatedValue),
                  ];
            }
            return [state, loadableWithValue$2(options.default)];
          },
          set: function (store, state, newValue) {
            var _state$atomValues$get;
            return (
              initAtom(store, state, 'set'),
              (
                state.atomValues.has(key)
                  ? newValue ===
                    (null ===
                      (_state$atomValues$get = state.atomValues.get(key)) ||
                    void 0 === _state$atomValues$get
                      ? void 0
                      : _state$atomValues$get.contents)
                  : newValue instanceof DefaultValue$1
              )
                ? [state, new Set()]
                : [
                    {
                      ...state,
                      dirtyAtoms: setByAddingToSet$4(state.dirtyAtoms, key),
                      atomValues:
                        newValue instanceof DefaultValue$1
                          ? mapByDeletingFromMap$2(state.atomValues, key)
                          : mapBySettingInMap$3(
                              state.atomValues,
                              key,
                              loadableWithValue$2(newValue),
                            ),
                      nonvalidatedAtoms: mapByDeletingFromMap$2(
                        state.nonvalidatedAtoms,
                        key,
                      ),
                    },
                    new Set([key]),
                  ]
            );
          },
        });
        return node;
      })({...restOptions, default: optionsDefault});
}
var Recoil_atom = atom;
var Recoil_stableStringify = function (x, opt = {allowFunctions: !1}) {
  return (function stringify(x, opt, key) {
    if ('string' == typeof x && !x.includes('"') && !x.includes('\\'))
      return `"${x}"`;
    switch (typeof x) {
      case 'undefined':
        return '';
      case 'boolean':
        return x ? 'true' : 'false';
      case 'number':
      case 'symbol':
        return String(x);
      case 'string':
        return JSON.stringify(x);
      case 'function':
        if (!0 !== (null == opt ? void 0 : opt.allowFunctions))
          throw new Error(
            'Attempt to serialize function in a Recoil cache key',
          );
        return `__FUNCTION(${x.name})__`;
    }
    return null === x
      ? 'null'
      : 'object' != typeof x
      ? null !== (_JSON$stringify = JSON.stringify(x)) &&
        void 0 !== _JSON$stringify
        ? _JSON$stringify
        : ''
      : Recoil_isPromise(x)
      ? '__PROMISE__'
      : Array.isArray(x)
      ? `[${x.map((v, i) => stringify(v, opt, i.toString()))}]`
      : 'function' == typeof x.toJSON
      ? stringify(x.toJSON(key), opt, key)
      : x instanceof Map
      ? stringify(
          Array.from(x).reduce(
            (obj, [k, v]) => ({
              ...obj,
              ['string' == typeof k ? k : stringify(k, opt)]: v,
            }),
            {},
          ),
          opt,
          key,
        )
      : x instanceof Set
      ? stringify(
          Array.from(x).sort((a, b) =>
            stringify(a, opt).localeCompare(stringify(b, opt)),
          ),
          opt,
          key,
        )
      : null != x[Symbol.iterator] && 'function' == typeof x[Symbol.iterator]
      ? stringify(Array.from(x), opt, key)
      : `{${Object.keys(x)
          .filter(key => void 0 !== x[key])
          .sort()
          .map(key => `${stringify(key, opt)}:${stringify(x[key], opt, key)}`)
          .join(',')}}`;
    var _JSON$stringify;
  })(x, opt);
};
var Recoil_cacheWithValueEquality = function () {
  const map = new Map(),
    cache = {
      get: key => map.get(Recoil_stableStringify(key)),
      set: (key, value) => (map.set(Recoil_stableStringify(key), value), cache),
      map: map,
    };
  return cache;
};
let nextIndex = 0;
var Recoil_selectorFamily = function (options) {
  var _options$cacheImpleme, _options$cacheImpleme2;
  let selectorCache =
    null !==
      (_options$cacheImpleme =
        null ===
          (_options$cacheImpleme2 =
            options.cacheImplementationForParams_UNSTABLE) ||
        void 0 === _options$cacheImpleme2
          ? void 0
          : _options$cacheImpleme2.call(options)) &&
    void 0 !== _options$cacheImpleme
      ? _options$cacheImpleme
      : Recoil_cacheWithValueEquality();
  return params => {
    var _stableStringify, _options$cacheImpleme3;
    const cachedSelector = selectorCache.get(params);
    if (null != cachedSelector) return cachedSelector;
    const myKey = `${options.key}__selectorFamily/${
        null !==
          (_stableStringify = Recoil_stableStringify(params, {
            allowFunctions: !0,
          })) && void 0 !== _stableStringify
          ? _stableStringify
          : 'void'
      }/${nextIndex++}`,
      myGet = callbacks => options.get(params)(callbacks),
      myCacheImplementation =
        null ===
          (_options$cacheImpleme3 = options.cacheImplementation_UNSTABLE) ||
        void 0 === _options$cacheImpleme3
          ? void 0
          : _options$cacheImpleme3.call(options);
    let newSelector;
    if (null != options.set) {
      const set = options.set;
      newSelector = Recoil_selector({
        key: myKey,
        get: myGet,
        set: (callbacks, newValue) => set(params)(callbacks, newValue),
        cacheImplementation_UNSTABLE: myCacheImplementation,
        dangerouslyAllowMutability: options.dangerouslyAllowMutability,
      });
    } else
      newSelector = Recoil_selector({
        key: myKey,
        get: myGet,
        cacheImplementation_UNSTABLE: myCacheImplementation,
        dangerouslyAllowMutability: options.dangerouslyAllowMutability,
      });
    return (
      (selectorCache = selectorCache.set(params, newSelector)), newSelector
    );
  };
};
const {
  DEFAULT_VALUE: DEFAULT_VALUE$5,
  DefaultValue: DefaultValue$2,
} = Recoil_Node;
var Recoil_atomFamily = function (options) {
  let atomCache = Recoil_cacheWithValueEquality();
  const legacyAtomOptions = {
    key: options.key,
    default: DEFAULT_VALUE$5,
    persistence_UNSTABLE: options.persistence_UNSTABLE,
  };
  let legacyAtom;
  legacyAtom = Recoil_atom(legacyAtomOptions);
  const atomFamilyDefault = Recoil_selectorFamily({
    key: options.key + '__atomFamily/Default',
    get: param => ({get: get}) => {
      const legacyValue = get(
        'function' == typeof legacyAtom ? legacyAtom(param) : legacyAtom,
      );
      return legacyValue instanceof DefaultValue$2
        ? 'function' == typeof options.default
          ? options.default(param)
          : options.default
        : legacyValue;
    },
    dangerouslyAllowMutability: options.dangerouslyAllowMutability,
  });
  return params => {
    var _stableStringify;
    const cachedAtom = atomCache.get(params);
    if (null != cachedAtom) return cachedAtom;
    const newAtom = Recoil_atom({
      ...options,
      key: `${options.key}__${
        null !== (_stableStringify = Recoil_stableStringify(params)) &&
        void 0 !== _stableStringify
          ? _stableStringify
          : 'void'
      }`,
      default: atomFamilyDefault(params),
    });
    return (atomCache = atomCache.set(params, newAtom)), newAtom;
  };
};
const constantSelector = Recoil_selectorFamily({
  key: '__constant',
  get: constant => () => constant,
  cacheImplementationForParams_UNSTABLE: Recoil_cacheWithReferenceEquality,
});
var Recoil_constSelector = function (constant) {
  return constantSelector(constant);
};
const throwingSelector = Recoil_selectorFamily({
  key: '__error',
  get: message => () => {
    throw new Error(message);
  },
  cacheImplementationForParams_UNSTABLE: Recoil_cacheWithReferenceEquality,
});
var Recoil_errorSelector = function (message) {
  return throwingSelector(message);
};
var Recoil_readOnlySelector = function (atom) {
  return atom;
};
const {
  loadableWithError: loadableWithError$2,
  loadableWithPromise: loadableWithPromise$2,
  loadableWithValue: loadableWithValue$3,
} = Recoil_Loadable;
function concurrentRequests(getRecoilValue, deps) {
  const results = Array(deps.length).fill(void 0),
    exceptions = Array(deps.length).fill(void 0);
  for (const [i, dep] of deps.entries())
    try {
      results[i] = getRecoilValue(dep);
    } catch (e) {
      exceptions[i] = e;
    }
  return [results, exceptions];
}
function isError(exp) {
  return null != exp && !Recoil_isPromise(exp);
}
function unwrapDependencies(dependencies) {
  return Array.isArray(dependencies)
    ? dependencies
    : Object.getOwnPropertyNames(dependencies).map(key => dependencies[key]);
}
function wrapResults(dependencies, results) {
  return Array.isArray(dependencies)
    ? results
    : Object.getOwnPropertyNames(dependencies).reduce(
        (out, key, idx) => ({...out, [key]: results[idx]}),
        {},
      );
}
function wrapLoadables(dependencies, results, exceptions) {
  return wrapResults(
    dependencies,
    exceptions.map((exception, idx) =>
      null == exception
        ? loadableWithValue$3(results[idx])
        : Recoil_isPromise(exception)
        ? loadableWithPromise$2(exception)
        : loadableWithError$2(exception),
    ),
  );
}
var Recoil_WaitFor = {
  waitForNone: Recoil_selectorFamily({
    key: '__waitForNone',
    get: dependencies => ({get: get}) => {
      const deps = unwrapDependencies(dependencies),
        [results, exceptions] = concurrentRequests(get, deps);
      return wrapLoadables(dependencies, results, exceptions);
    },
  }),
  waitForAny: Recoil_selectorFamily({
    key: '__waitForAny',
    get: dependencies => ({get: get}) => {
      const deps = unwrapDependencies(dependencies),
        [results, exceptions] = concurrentRequests(get, deps);
      if (exceptions.some(exp => null == exp))
        return wrapLoadables(dependencies, results, exceptions);
      if (exceptions.every(isError)) throw exceptions.find(isError);
      throw new Promise((resolve, reject) => {
        for (const [i, exp] of exceptions.entries())
          Recoil_isPromise(exp) &&
            exp
              .then(result => {
                (results[i] = result),
                  (exceptions[i] = null),
                  resolve(wrapLoadables(dependencies, results, exceptions));
              })
              .catch(error => {
                (exceptions[i] = error),
                  exceptions.every(isError) && reject(exceptions[0]);
              });
      });
    },
  }),
  waitForAll: Recoil_selectorFamily({
    key: '__waitForAll',
    get: dependencies => ({get: get}) => {
      const deps = unwrapDependencies(dependencies),
        [results, exceptions] = concurrentRequests(get, deps);
      if (exceptions.every(exp => null == exp))
        return wrapResults(dependencies, results);
      const error = exceptions.find(isError);
      if (null != error) throw error;
      throw Promise.all(exceptions).then(results =>
        wrapResults(dependencies, results),
      );
    },
  }),
  noWait: Recoil_selectorFamily({
    key: '__noWait',
    get: dependency => ({get: get}) => {
      try {
        return loadableWithValue$3(get(dependency));
      } catch (exception) {
        return Recoil_isPromise(exception)
          ? loadableWithPromise$2(exception)
          : loadableWithError$2(exception);
      }
    },
  }),
};
const {
    unstable_batchedUpdates: unstable_batchedUpdates$1,
  } = ReactBatchedUpdates,
  {setBatch: setBatch$1} = Recoil_batch;
setBatch$1(unstable_batchedUpdates$1);
const {DefaultValue: DefaultValue$3} = Recoil_Node,
  {RecoilRoot: RecoilRoot$1} = Recoil_RecoilRoot_react,
  {isRecoilValue: isRecoilValue$3} = require$$4,
  {
    useGotoRecoilSnapshot: useGotoRecoilSnapshot$1,
    useRecoilCallback: useRecoilCallback$1,
    useRecoilSnapshot: useRecoilSnapshot$1,
    useRecoilState: useRecoilState$1,
    useRecoilStateLoadable: useRecoilStateLoadable$1,
    useRecoilTransactionObserver: useRecoilTransactionObserver$1,
    useRecoilValue: useRecoilValue$1,
    useRecoilValueLoadable: useRecoilValueLoadable$1,
    useResetRecoilState: useResetRecoilState$1,
    useSetRecoilState: useSetRecoilState$1,
    useSetUnvalidatedAtomValues: useSetUnvalidatedAtomValues$1,
    useTransactionObservation_DEPRECATED: useTransactionObservation_DEPRECATED$1,
  } = Recoil_Hooks,
  {
    noWait: noWait$1,
    waitForAll: waitForAll$1,
    waitForAny: waitForAny$1,
    waitForNone: waitForNone$1,
  } = Recoil_WaitFor;
var Recoil_index = {
    DefaultValue: DefaultValue$3,
    RecoilRoot: RecoilRoot$1,
    atom: Recoil_atom,
    selector: Recoil_selector,
    atomFamily: Recoil_atomFamily,
    selectorFamily: Recoil_selectorFamily,
    constSelector: Recoil_constSelector,
    errorSelector: Recoil_errorSelector,
    readOnlySelector: Recoil_readOnlySelector,
    useRecoilValue: useRecoilValue$1,
    useRecoilValueLoadable: useRecoilValueLoadable$1,
    useRecoilState: useRecoilState$1,
    useRecoilStateLoadable: useRecoilStateLoadable$1,
    useSetRecoilState: useSetRecoilState$1,
    useResetRecoilState: useResetRecoilState$1,
    useRecoilCallback: useRecoilCallback$1,
    useGotoRecoilSnapshot: useGotoRecoilSnapshot$1,
    useRecoilSnapshot: useRecoilSnapshot$1,
    useRecoilTransactionObserver_UNSTABLE: useRecoilTransactionObserver$1,
    useTransactionObservation_UNSTABLE: useTransactionObservation_DEPRECATED$1,
    useSetUnvalidatedAtomValues_UNSTABLE: useSetUnvalidatedAtomValues$1,
    noWait: noWait$1,
    waitForNone: waitForNone$1,
    waitForAny: waitForAny$1,
    waitForAll: waitForAll$1,
    isRecoilValue: isRecoilValue$3,
    setBatch: setBatch$1,
  },
  Recoil_index_1 = Recoil_index.DefaultValue,
  Recoil_index_2 = Recoil_index.RecoilRoot,
  Recoil_index_3 = Recoil_index.atom,
  Recoil_index_4 = Recoil_index.selector,
  Recoil_index_5 = Recoil_index.atomFamily,
  Recoil_index_6 = Recoil_index.selectorFamily,
  Recoil_index_7 = Recoil_index.constSelector,
  Recoil_index_8 = Recoil_index.errorSelector,
  Recoil_index_9 = Recoil_index.readOnlySelector,
  Recoil_index_10 = Recoil_index.useRecoilValue,
  Recoil_index_11 = Recoil_index.useRecoilValueLoadable,
  Recoil_index_12 = Recoil_index.useRecoilState,
  Recoil_index_13 = Recoil_index.useRecoilStateLoadable,
  Recoil_index_14 = Recoil_index.useSetRecoilState,
  Recoil_index_15 = Recoil_index.useResetRecoilState,
  Recoil_index_16 = Recoil_index.useRecoilCallback,
  Recoil_index_17 = Recoil_index.useGotoRecoilSnapshot,
  Recoil_index_18 = Recoil_index.useRecoilSnapshot,
  Recoil_index_19 = Recoil_index.useRecoilTransactionObserver_UNSTABLE,
  Recoil_index_20 = Recoil_index.useTransactionObservation_UNSTABLE,
  Recoil_index_21 = Recoil_index.useSetUnvalidatedAtomValues_UNSTABLE,
  Recoil_index_22 = Recoil_index.noWait,
  Recoil_index_23 = Recoil_index.waitForNone,
  Recoil_index_24 = Recoil_index.waitForAny,
  Recoil_index_25 = Recoil_index.waitForAll,
  Recoil_index_26 = Recoil_index.isRecoilValue,
  Recoil_index_27 = Recoil_index.setBatch;
(exports.DefaultValue = Recoil_index_1),
  (exports.RecoilRoot = Recoil_index_2),
  (exports.atom = Recoil_index_3),
  (exports.atomFamily = Recoil_index_5),
  (exports.constSelector = Recoil_index_7),
  (exports.default = Recoil_index),
  (exports.errorSelector = Recoil_index_8),
  (exports.isRecoilValue = Recoil_index_26),
  (exports.noWait = Recoil_index_22),
  (exports.readOnlySelector = Recoil_index_9),
  (exports.selector = Recoil_index_4),
  (exports.selectorFamily = Recoil_index_6),
  (exports.setBatch = Recoil_index_27),
  (exports.useGotoRecoilSnapshot = Recoil_index_17),
  (exports.useRecoilCallback = Recoil_index_16),
  (exports.useRecoilSnapshot = Recoil_index_18),
  (exports.useRecoilState = Recoil_index_12),
  (exports.useRecoilStateLoadable = Recoil_index_13),
  (exports.useRecoilTransactionObserver_UNSTABLE = Recoil_index_19),
  (exports.useRecoilValue = Recoil_index_10),
  (exports.useRecoilValueLoadable = Recoil_index_11),
  (exports.useResetRecoilState = Recoil_index_15),
  (exports.useSetRecoilState = Recoil_index_14),
  (exports.useSetUnvalidatedAtomValues_UNSTABLE = Recoil_index_21),
  (exports.useTransactionObservation_UNSTABLE = Recoil_index_20),
  (exports.waitForAll = Recoil_index_25),
  (exports.waitForAny = Recoil_index_24),
  (exports.waitForNone = Recoil_index_23);
