import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import LogIn from './pages/LogIn/LogIn'
import SignUp from './pages/SignUp/SignUp'

const routes = (
  <Router>
    <Routes>
      <Route path='/dashboard' exact element = {<Home/>}/>
      <Route path='/LogIn' exact element = {<LogIn/>}/>
      <Route path='/SignUp' exact element = {<SignUp/>}/>
    </Routes>
  </Router>
)

const App = ()=>{
  return (
    <>
      {routes}
    </>
  )
}

export default App