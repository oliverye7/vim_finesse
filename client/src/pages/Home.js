import React from "react";
import Header from "../components/Home/Header";
import Body from "../components/Home/Body";
import Footer from "../components/Home/Footer";

function Home(props) {
  return (
    <div className="text-3xl flex flex-col h-screen">
      <Header />
      <main className="flex-grow mt-20">
        <Body />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
