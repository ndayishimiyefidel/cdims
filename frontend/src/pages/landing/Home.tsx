import React from 'react'
import HeroSection from '../../components/landing/home/HeroSection';
import AboutSection from '../../components/landing/home/About';
import Categories from '../../components/landing/home/Categories';
import FeaturedProducts from '../../components/landing/home/Featured';
import Testimonials from '../../components/landing/home/Testimonials';

const Home = () => {
  return (
    <main>
        <HeroSection />
        <AboutSection />
        <Categories />
        <FeaturedProducts />
        <Testimonials />
      </main>
  )
}

export default Home