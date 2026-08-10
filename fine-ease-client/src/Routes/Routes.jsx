import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Error from "../Pages/Error/Error";
import AddTransaction from "../Pages/AddTransaction/AddTransaction";
import MyTransaction from "../Pages/MyTransaction/MyTransaction";
import Reports from "../Pages/Report/Reports";
import MyProfile from "../Pages/MyProfile/MyProfile";
import Privateroutes from "../PrivateRoutes/Privateroutes";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>,
        children: [
            {
                index: true,
                element: <Home></Home>,
            },
            {
                path: '/login',
                element: <Login></Login>,
            },
            {
                path: '/signup',
                element: <Register></Register>
            },
            {
                path: '/addTransaction',
                element: <Privateroutes>
                    <AddTransaction></AddTransaction>
                </Privateroutes>,
                
            },
            {
                path: '/myTransaction',
                element: <Privateroutes>
                    <MyTransaction></MyTransaction>
                </Privateroutes>,
                // loader: ()=> fetch
            },
            {
                path: '/reports',
                element: <Privateroutes>
                    <Reports></Reports>
                </Privateroutes>,
            },
            {
                path: '/myProfile',
                element: <MyProfile></MyProfile>,
            }
        ]
    },
    {
        path: '*',
        element: <Error></Error>
    }
]);


export default router;