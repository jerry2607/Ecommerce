import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { newReviewReducer, productDetailsReducer , productsReducer} from "./reducers/productReducer";
import {cartReducer} from "./reducers/cartReducer";
import { newOrderReducer, orderDetailsReducer ,myOrdersReducer} from "./reducers/orderReducer";
import { userReducer } from "./reducers/userReducer";

const reducer = combineReducers({
  productDetails : productDetailsReducer ,
  cart : cartReducer ,
  newOrder : newOrderReducer,
  user: userReducer,
  myOrders : myOrdersReducer,
  orderDetails : orderDetailsReducer,
  newReview : newReviewReducer,
  products:productsReducer,
});

let initialState = {
  cart : {
    cartItems : localStorage.getItem("cartItems")? (JSON.parse(localStorage.getItem("cartItems"))) :[],
    shippingInfo : localStorage.getItem("shippingInfo")? (JSON.parse(localStorage.getItem("shippingInfo"))) :{},

  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);


export default store;