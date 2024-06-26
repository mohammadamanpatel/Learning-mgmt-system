import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function RequiredAuth({ allowedRoles }) {
    
    const { isLoggedIn, role } = useSelector((state) => state.auth);
    console.log("isLoggedIn, role",isLoggedIn, role);
    return isLoggedIn && allowedRoles.find((myrole) => myrole == role) ? (
        <Outlet />
    ) : isLoggedIn ? (<Navigate to="/denied" />) : (<Navigate to="/login" />);

}

export default RequiredAuth;