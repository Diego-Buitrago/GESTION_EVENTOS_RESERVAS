import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout';
import Eventos from '../pages/Eventos';
import { Reservas } from '../pages/Reservas';

export const router = createBrowserRouter([
  {
    path: "/",
    // element: <Layout />,
    element: <Eventos />,
    // errorElement: <ErrorPage />,
    // children: [
    //   {
    //     path: "",
    //     element: <Eventos />
    //   },
    //   {
    //     path: "reservas",
    //     element: <Reservas />
    //   }
    // ]
  }
]);