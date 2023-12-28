import React from "react";

function Header(props) {
  return (
    <div className="bg-pink-200 flex h-8">
      <div className="text-3xl font-bold justify-self-start">MR. BEAN TRUCK</div>
      <div className="flex gap-4 justify-self-end">
        <a href="/" className="hover:text-gray-300 transition-colors">Home</a>
        <a href="/games" className="hover:text-gray-300 transition-colors">Games</a>
        <a href="/about" className="hover:text-gray-300 transition-colors">About</a>
        <a href="/login" className="bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition-colors">Log in</a>
      </div>
    </div>
  );
}

export default Header;
