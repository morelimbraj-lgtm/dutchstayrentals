import Navigation from './components/Navigation';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import Properties from './components/Properties';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <AboutSection />
        <Properties />
      </main>
      <Footer />
    </>
  );
}

export default App;
