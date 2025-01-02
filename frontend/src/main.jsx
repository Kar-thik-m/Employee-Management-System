
import { createRoot } from 'react-dom/client'
import './index.css'
import store from './Redux/Store/Store.js'
import { Provider } from 'react-redux'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
 
  <Provider store={store}>
    <App />
  </Provider>
)
