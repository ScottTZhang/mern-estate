import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { persistor, store } from './redux/store.js'
import { Provider } from 'react-redux'; // makes the Redux store available to any nested components that need to access the Redux store.
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <App />
  </PersistGate>
  </Provider>,
)
