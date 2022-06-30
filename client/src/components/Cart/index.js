// // Currently the Cart component is populated with data from the global state object and not the useQuery() Hook, because the data doesn't come from the server. We want to set up this component to check for items saved in the cart object store of IndexedDB every single time the component opens. But how can we do that?
// We can use the useEffect() Hook!
import React, { useEffect } from "react";
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";

const Cart = () => {

    // You'll use the custom useStoreContext Hook to establish a state variable and the dispatch() function to update the state. In this case, dispatch() will call the TOGGLE_CART action.
    const [state, dispatch] = useStoreContext();


    // Now let's set up the useEffect() Hook in the Cart component's function to check if there's anything in the state's cart property on load. If not, we'll retrieve data from the IndexedDB cart object store.
    // With this function in place, we're checking to see if state.cart.length is 0, then executing getCart() to retrieve the items from the cart object store and save it to the global state object. We dispatch the ADD_MULTIPLE_TO_CART action here because we have an array of items returning from IndexedDB, even if it's just one product saved. This way we can just dump all of the products into the global state object at once instead of doing it one by one.   
    useEffect(() => {
        async function getCart() {
            const cart = await idbPromise('cart', 'get');
            dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
        };

        // You may wonder what happens if there's nothing to retrieve from the cached object store and state.cart.length is still 0. Does this useEffect() function just continuously run because of that?
        // Well, it could very easily do that if we neglect to pass the state.cart.length value into useEffect()'s dependency array. That's the whole point of the dependency array. We list all of the data that this useEffect() Hook is dependent on to execute. The Hook runs on load no matter what, but then it only runs again if any value in the dependency array has changed since the last time it ran.
        if (!state.cart.length) {
            getCart();
        }
    }, [state.cart.length, dispatch]);


    function toggleCart() {
        dispatch({ type: TOGGLE_CART });
    }

    // This function will add up the prices of everything saved in state.cart, which can then be displayed in the JSX.
    function calculateTotal() {
        let sum = 0;
        state.cart.forEach(item => {
            sum += item.price * item.purchaseQuantity;
        });
        return sum.toFixed(2);
    }


    // If cartOpen is false, the component will return a much smaller <div>. Clicking this <div>, however, will set cartOpen to true and return the expanded shopping cart.
    // You should always wrap emojis (like the shopping cart icon) in a <span> element that includes role and aria-label attributes. Doing so will help screen readers understand the context of the emoji.
    if (!state.cartOpen) {
        return (
            <div className="cart-closed" onClick={toggleCart}>
                <span
                    role="img"
                    aria-label="trash">🛒</span>
            </div>
        );
    }


    return (
        <div className="cart">
            <div className="close" onClick={toggleCart}>[close]</div>
            <h2>Shopping Cart</h2>
            {state.cart.length ? (
                <div>
                    {state.cart.map(item => (
                        <CartItem key={item._id} item={item} />
                    ))}
                    <div className="flex-row space-between">
                        <strong>Total: ${calculateTotal()}</strong>
                        {
                            Auth.loggedIn() ?
                                <button>
                                    Checkout
                                </button>
                                :
                                <span>(log in to check out)</span>
                        }
                    </div>
                </div>
            ) : (
                <h3>
                    <span role="img" aria-label="shocked">
                        😱
                    </span>
                    You haven't added anything to your cart yet!
                </h3>
            )}
        </div>
    );
};

export default Cart;