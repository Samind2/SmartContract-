import { Navbar, Welcome, Footer, Services, Transactions } from './components'
import GitBtn from './components/GitBtn'

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <GitBtn />
        <Welcome />
      </div>
        <Services />
        <Transactions />
        <Footer />
    </div>
  )
}

export default App