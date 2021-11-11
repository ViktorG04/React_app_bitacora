import { createContext } from "react";

const UserLoginContext = createContext({
    userLogin: '',
    setUserLogin: null,
});

export default UserLoginContext;
