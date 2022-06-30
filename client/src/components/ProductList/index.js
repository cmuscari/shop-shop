import React, { useEffect } from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { idbPromise } from "../../utils/helpers";

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';

function ProductList() {
  const [state, dispatch] = useStoreContext();

  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);


  // We should set it up so that when we save product data from the useQuery() Hook's response to the global state object with the dispatch() method, we also save each file to the products object store in IndexedDB using the idbPromise() function.
  // Also, Let's set it up so that if the useQuery() Hook isn't establishing a connection to the GraphQL server, we'll use the data stored in IndexedDB instead.
  // If we're offline and we run the useQuery() Hook, we'll never be in a state of loading data. This means that the loading response Apollo provides to indicate that we're still waiting for a response won't exist, because we're no longer waiting for data. The data simply isn't coming.
  // With that in mind, we've added in a check after the if (data) statement to see if we should lean on IndexedDB for the data instead. If so, we'll run idbPromise() to get all of the data from the products store and use the returning array of product data to update the global store.
  // This portion may be tricky to test at the moment, but it'll pay off when the app is in production. Users won't even notice if they lose their connection!
  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
      // add else if to check if `loading` is undefined in `useQuery()` Hook
    } else if (!loading) {
      // since we're offline, get all of the data from the `products` store
      idbPromise('products', 'get').then((products) => {
        // use retrieved data to set global state for offline browsing
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        });
      });
    }
  }, [data, loading, dispatch]);



  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
