import React, { useState } from "react";
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";
import Cart from '../components/Cart';

// The Home page component manages the state currentCategory, which is passed to the ProductList component as a prop and instructs which category's products should be retrieved using Apollo. To set that currentCategory value, however, the setCategory callback function is passed to the CategoryMenu component as a prop to be executed on a new category pick.
// const Home = () => {
//   const [currentCategory, setCategory] = useState("");

//   return (
//     <div className="container">
//       <CategoryMenu setCategory={setCategory} />
//       <ProductList currentCategory={currentCategory} />
//     </div>
//   );
// };

// Before, when it was managing state to be used by other components, it didn't even get to use that data! Now all this component has to concern itself with is displaying the other components, which makes it much easier to build upon in the future.

const Home = () => {
  return (
    <div className="container">
      <CategoryMenu />
      <ProductList />
      <Cart />
    </div>
  );
};

export default Home;
