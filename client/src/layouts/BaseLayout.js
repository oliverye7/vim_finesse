import React from "react";
import Header from "../components/Home/Header.tsx";
import Footer from "../components/Home/Footer.tsx";

const BaseLayout = ({ children }) => {
  return (
    <div className="text-3xl flex flex-col h-screen bg-blue-200">
      <Header />
      <main className="px-16 flex-grow mt-20 bg-blue-200">{children}</main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
