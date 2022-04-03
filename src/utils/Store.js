import Cookies from "js-cookie";
import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
    darkMode: Cookies.get('darkMode')  === 'ON' ? true : false,
    userInfo: Cookies.get('user') !== null,
}

function reducer(state, action){
    switch(action.type){
        case "DARK_MODE_ON":
            return {...state, darkMode: true};
        case "DARK_MODE_OFF":
            return {...state, darkMode: false};
        case "USER_LOGIN": 
            return {...state, user: true };
        case "USER_LOGOUT": 
            return {...state, user: false, };
        default:
            return state;
    }
}

export function StoreProvider(props){
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}</Store.Provider>;
}


