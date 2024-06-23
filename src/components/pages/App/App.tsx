import './App.style.scss'

import Navbar from '../../organisms/Navbar/Navbar'
import Footer from '../../organisms/Footer/Footer'
import Cover from '../../organisms/Cover/Cover'
import Skills from '../../organisms/Skills/Skills'
import Projects from '../../organisms/Projects/Projects'
import Intro from '../../atoms/Intro/Intro'

function App() {

  return (
    <>
      <Navbar />
      <Cover />
      <Intro />
      <Skills />
      <Projects />
      <Footer />
    </>
  )
}

export default App
