// in short, what we did here was create our own functionality to manage state at a global level and make it available to all of our other components through a special <Provider> component.




// createContext will be used to instantiate a new Context object. The more meaningful term we can use here is that we're using it to create the container to hold our global state data and functionality so we can provide it throughout our app!
import React, { createContext, useContext } from "react";
// useContext is another React Hook that will allow us to use the state created from the createContext function.
import { useProductReducer } from './reducers';

// actually instantiates the global state object
const StoreContext = createContext();
const { Provider } = StoreContext;

// Every Context object comes with two components, a Provider and Consumer. 
// The Provider is a special type of React component that we wrap our application in so it can make the state data that's passed into it as a prop available to all other components. 
// The Consumer is our means of grabbing and using the data that the Provider holds for us.


// The value prop is good to have included, as it opens us up to pass in more data for state if we need to. We don't actually need to in this app, but it makes this provider flexible. The other prop, or rather ...props, is in place to handle any other props the user may need. Namely, we'll need to use props.children, as this <StoreProvider> component will wrap all of our other components, making them children of it. If we didn't include {...props} in our returning <Provider> component, nothing on the page would be rendered!
const StoreProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useProductReducer({
    products: [],
    cart: [],
    cartOpen: false,
    categories: [],
    currentCategory: ''
  });
  // use this to confirm it works!
  console.log(state);
  return <Provider value={[state, dispatch]} {...props} />;
};


// The last thing we need to do is create the custom function using the useContext() Hook to be used by the components that actually need the data our <StoreProvider> will be, well . . . providing!
// We just created our own custom React Hook! When we execute this function from within a component, we will receive the [state, dispatch] data our StoreProvider provider manages for us. This means that any component that has access to our StoreProvider component can use any data in our global state container or update it using the dispatch function.
const useStoreContext = () => {
  return useContext(StoreContext);
};



export { StoreProvider, useStoreContext };






















