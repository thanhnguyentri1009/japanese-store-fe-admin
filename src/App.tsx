import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, Spin, theme } from 'antd'
import enUS from 'antd/locale/en_US'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppContainer from './AppContainer'
import Routers from './Routers'
import { bootstrapAuth } from './services/axios'

const queryClient = new QueryClient()

export default function App() {
  // The access token lives in memory only, so a page reload needs one round trip to
  // /auth/refresh (via the httpOnly refresh_token cookie) before we know whether there's
  // a session to restore. Routes render only after that resolves, one way or the other.
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    bootstrapAuth().finally(() => setIsBootstrapping(false))
  }, [])

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
        {isBootstrapping ? (
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <BrowserRouter>
            <AppContainer>
              <Routers />
            </AppContainer>
          </BrowserRouter>
        )}
      </ConfigProvider>
    </QueryClientProvider>
  )
}
