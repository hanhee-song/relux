## Relux Example

This is the current spoofed React framework that I'm using to develop Relux. Relux can be found in ```src/relux```.

# Relux Core

Relux is a state management system modeled after Redux. I coded the core codebase in a short 24 hours to challenge and test my meta knowledge. It can be used in virtually the exact same way that Redux is used with multiple enhancements that cut down on overall boilerplate code.

### API

Relux comes with many of Redux's core features, including:

#### ```createStore(reducer[, state, middleware])```

This function will create a new store.

Unlike Redux - which instantiates a store that needs to be passed around to React components - the current iteration of Relux will internally instantiate a store instance. This has two primary side effects:
- Only one instance of Store can be created. This shouldn't be a problem, since Redux was originally intended to be used with one instance anyways.
- Store does not need to be passed down into React components. This means that we have no need for ```Provider``` to pass the store down to its children. Thus, the App can be created without the store like this:

```JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById('root');
  const store = configureStore();
  ReactDOM.render(<App />, root);
});
```

#### ```applyMiddleware([arg1, arg2, ...])``` (optional)

When using middleware, this function should wrap the middleware as the third argument in createStore. Example:
```JavaScript
export default (preloadedState = {}) => {
  return createStore(
    RootReducer,
    preloadedState,
    applyMiddleware(logger, thunk)
  );
};
```
NB: this function merely exists to follow the Redux convention but is not necessary. The following code is just as valid:
```JavaScript
export default (preloadedState = {}) => {
  return createStore(
    RootReducer,
    preloadedState,
    [logger, thunk]
  );
};
```

#### ```combineReducers(reducers)``` (optional)

Takes in an Object with reducers. Example:
```JavaScript
const rootReducer = combineReducers({
  entities: entitiesReducer,
  session: sessionReducer
});
```
Note: combineReducers merely checks that its values are all valid reducers. In the above example, exporting the object itself would have had the same effect without the validity check. Furthermore, combineReducers can be used at the root reducer level (if at all) and still recursively check all sub-reducers for validity. This enables us to be show the state shape in a simple and explicit manner as follows:
```JavaScript
const rootReducer = {
  entities: {
    users: UserReducer,
    Channels: ChannelReducer,
  },
  session: SessionReducer,
  ui: {
    modal: ModalReducer,
    settings: {
      server: ServerSettingsReducer
    }
  }
}
```

## Relux-Thunk

#### ```thunk```

Similarly to Redux-Thunk, Thunk is a middleware that enables Relux to optionally accommodate an async action that returns a promise, most commonly in the case of AJAX calls. Example:
```JavaScript
// Without thunk, you can only dispatch:
export const receiveUser = user => ({
  type: RECEIVE_USER,
  user
});

// With thunk, you can also send an async action:
export const fetchUser = id => dispatch => {
  return fetch(
    // ...
  ).then(
    user => dispatch(receiveUser(user))
  )
}
```

## Relux-Logger

#### ```logger```

Logger is middleware that can show the previous state, action, next state, and relevant timestamps every time an action is fired. A sample picture is provided below:

<img src="https://i.imgur.com/AvkhIVw.png" alt="sample picture of relux logger" style="width: 400px;"/>

NB: when using multiple middleware, ```logger``` should be the first argument passed into ```applyMiddleware```.

## React-Relux

#### ```connect(mapStateToProps, mapDispatchToProps)```

Takes in two functions and returns a function. The returned function must be invoked with the react component that is to receive the props. If you don't need one of the two arguments, pass in the keyword ```null``` instead of ```undefined```.

* ```mapStateToProps(state, props)```: returns an object with key-value pairs that further define props on the React component based on the Store's state.
* ```mapDispatchToProps(dispatch, props)```: returns an object with key-value pairs that define dispatchable actions to be props of the React component.

If one of the arguments is not needed, you must explicitly pass in ```null``` as an argument instead.

Example:
```JavaScript
const mapStateToProps = (state, ownProps) => {
  return {
    channels: Object.values(state.entities.channels),
    dropdown: state.ui.dropdown,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    clearDropdown: () => dispatch(clearDropdown()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelIndex);
```
