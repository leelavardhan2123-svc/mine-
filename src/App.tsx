import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import RomanticBackground from './components/background/RomanticBackground'
import SectionNav from './components/navigation/SectionNav'
import FinalScreen from './components/sections/FinalScreen'
import IntroBand from './components/sections/IntroBand'
import LoveLetter from './components/sections/LoveLetter'
import LoveStory from './components/sections/LoveStory'
import MemoryGallery from './components/sections/MemoryGallery'
import MusicPlayer from './components/sections/MusicPlayer'
import SiteFooter from './components/sections/SiteFooter'
import Surprise from './components/sections/Surprise'
import WelcomeScreen from './components/sections/WelcomeScreen'
import WhySpecial from './components/sections/WhySpecial'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
  const [opened, setOpened] = useLocalStorage<boolean>(
    'forever-with-you:opened',
    false,
  )

  return (
    <MotionConfig reducedMotion="user">
      <RomanticBackground />

      {/* Keyboard users can jump straight into the story */}
      <a
        href="#story"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:font-sans focus:text-sm focus:text-love-primary focus:shadow-lg"
      >
        Skip to our love story
      </a>

      <AnimatePresence mode="wait">
        {opened ? (
          <motion.div
            key="experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            <SectionNav />
            <main>
              <IntroBand />
              <LoveStory />
              <LoveLetter />
              <MemoryGallery />
              <WhySpecial />
              <Surprise />
              <FinalScreen />
            </main>
            <SiteFooter />
          </motion.div>
        ) : (
          <WelcomeScreen key="welcome" onOpen={() => setOpened(true)} />
        )}
      </AnimatePresence>

      {/* Always available — never autoplays */}
      <MusicPlayer />
    </MotionConfig>
  )
}
