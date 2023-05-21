import React from 'react';
import Navbar from "./Navbar";
import {Outlet} from "react-router-dom";

const Layout = () => {
  return (
    <div className='mx-20 mb-4'>
      <header>
        <Navbar/>
      </header>
      <main className='mt-32'>
        <Outlet/>
      </main>
      <footer>
      </footer>
    </div>
  );
};

export default Layout;