// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import Promotions from '../components/Promotions';
import Footer from '../components/Footer';
import Features from '../components/Features';

function Home() {
  return (
    <div className=" ">
      <Banner />
      <Categories />
      <FeaturedProducts />
      {/* <Promotions /> */}
      <Testimonials />
      <Features />
     
    </div>
  );
}

export default Home;