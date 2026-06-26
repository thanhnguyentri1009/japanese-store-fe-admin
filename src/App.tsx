import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import viVN from 'antd/locale/vi_VN'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppContainer from './AppContainer'
import Routers from './Routers'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={viVN}
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#e63946',
            borderRadius: 8,
          },
        }}
      >
        <BrowserRouter>
          <AppContainer>
            <Routers />
          </AppContainer>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
