import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import MenuLayout from "./layouts/MenuLayout";
import MenuView from "./views/MenuView";

export default function App() {
    const browserRouter = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route element={<MenuLayout/>}>
                    <Route index element={<MenuView/>}/>
                </Route>
            </Route>
        )
    );

    return (
        <RouterProvider router={browserRouter}/>
    );
}