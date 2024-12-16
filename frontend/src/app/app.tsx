import { AppProvider } from './provider'
import { AppRoutes } from './router'


function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}

export default App
