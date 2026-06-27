import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import enUS from 'antd/locale/en_US'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppContainer from './AppContainer'
import Routers from './Routers'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={enUS}
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#8B5E3C',
            borderRadius: 8,
          },
        }}
      >
        <ToastContainer position="top-center" autoClose={3000} />
        <BrowserRouter>
          <AppContainer>
            <Routers />
          </AppContainer>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
