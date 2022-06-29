import React, { useEffect } from 'react';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { useStoreContext } from "../../utils/GlobalState";


// The big change we're about to implement is how the data gets to the UI. Currently, we have it set up to use the useQuery() Hook from Apollo to retrieve all of our category data and use it for the UI. This works great, but because we want to add offline capabilities later, this may become more difficult.
// Instead, we'll query our category data, store it into the global state object, and then use the category data from the global state object to use it in the UI instead.
function CategoryMenu() {
  // const { data: categoryData } = useQuery(QUERY_CATEGORIES);
  // const categories = categoryData?.categories || [];

  // Now when we use this component, we immediately call upon the useStoreContext() Hook to retrieve the current state from the global state object and the dispatch() method to update state. 
  const [state, dispatch] = useStoreContext();
  // Because we only need the categories array out of our global state, we simply destructure it out of state so we can use it to provide to our returning JSX.
  const { categories } = state;
  // Now, we still don't actually have any data in state yet. We need to somehow take the categoryData that returns from the useQuery() Hook and use the dispatch() method to set our global state. How can we do that if useQuery() is an asynchronous function? We can't simply just add the dispatch() method below it, as categoryData won't exist on load!
  // Instead, we need to use the React useEffect() Hook, which was created specifically for times like this. 
  const { data: categoryData } = useQuery(QUERY_CATEGORIES);



  // Now when this component loads and the response from the useQuery() Hook returns, the useEffect() Hook notices that categoryData is not undefined anymore and runs the dispatch() function, setting our category data to the global state!
  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      // execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
    }
  }, [categoryData, dispatch]);



  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };



  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
