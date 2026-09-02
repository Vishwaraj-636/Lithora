import React, { useState, useEffect } from 'react';
import Nav from '../shared/components/Nav';
import { Outlet } from 'react-router';



const AppLayout = () => {
   return (
      <>
         <Nav />
         <Outlet />
      </>
   );
};

export default AppLayout;