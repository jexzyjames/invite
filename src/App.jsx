import { useEffect, useState } from 'react'
import WeddingInvitation from './components/WeddingInvitation'
import WeddingPage from './components/WeddingPage'
import ValidationPage from './components/ValidationPage'

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateToWedding = () => {
    window.history.pushState({}, '', '/wedding')
    setPathname('/wedding')
  }

  if (pathname === '/validate') return <ValidationPage />
  if (pathname === '/wedding') return <WeddingPage />
  return <WeddingInvitation onOpen={navigateToWedding} />
}

export default App
