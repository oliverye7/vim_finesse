import React from "react";
import Header from "../components/Home/Header.tsx";
import Body from "../components/Home/Body.tsx";
import Footer from "../components/Home/Footer.tsx";

function Home() {
  return (
    <div className="text-3xl flex flex-col h-screen">
      <Header />
      <main className="flex-grow mt-20 bg-pink-200">
        <Body />
      </main>
      <Footer />
    </div>
  );
}

export default Home;