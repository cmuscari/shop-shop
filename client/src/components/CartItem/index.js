import React from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { idbPromise } from "../../utils/helpers";

// This component expects an item object as a prop and will use that object's properties to populate the JSX.
const CartItem = ({ item }) => {

    // Note that we only destructured the dispatch() function from the useStoreContext Hook, because the CartItem component has no need to read state
    const [, dispatch] = useStoreContext();

    // We can now remove an item directly from the cart, and it'll be reflected both in global state and in the cart object store.
    const removeFromCart = item => {
        dispatch({
            type: REMOVE_FROM_CART,
            _id: item._id
        });
        idbPromise('cart', 'delete', { ...item });
    };


    // The final feature is to allow users to manually edit the quantity of shopping cart items by typing directly in the <input> elements. Anytime an <input> element's value changes, an onChange event will occur. We can capture that event and send the element's new value to the reducer.
    const onChange = (e) => {
        const value = e.target.value;
        
        // Let's now update the onChange() function in this component to either remove an item or update an item's quantity from the cart object store, as well as global state. 
        if (value === '0') {
            dispatch({
                type: REMOVE_FROM_CART,
                _id: item._id
            });

            idbPromise('cart', 'delete', { ...item });
        } else {
            dispatch({
                type: UPDATE_CART_QUANTITY,
                _id: item._id,
                purchaseQuantity: parseInt(value)
            });

            idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
        }
    };



    return (
        <div className="flex-row">
            <div>
                <img
                    src={`/images/${item.image}`}
                    alt=""
                />
            </div>
            <div>
                <div>{item.name}, ${item.price}</div>
                <div>
                    <span>Qty:</span>
                    <input
                        type="number"
                        placeholder="1"
                        value={item.purchaseQuantity}
                        onChange={onChange}
                    />
                    <span
                        role="img"
                        aria-label="trash"
                        onClick={() => removeFromCart(item)}
                    >
                        🗑️
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CartItem;