export const apiUrls = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
  },

  profile: {
    me: '/profile/me',
  },

  accounts: {
    list: '/accounts',
    create: '/accounts',
    detail: (id: string) => `/accounts/${id}`,
    update: (id: string) => `/accounts/${id}`,
    delete: (id: string) => `/accounts/${id}`,
  },

  roles: {
    list: '/roles',
    detail: (id: string) => `/roles/${id}`,
  },

  categories: {
    list: '/categories',
    create: '/categories',
    detail: (id: string) => `/categories/${id}`,
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },

  brands: {
    list: '/brands',
    create: '/brands',
    detail: (id: string) => `/brands/${id}`,
    update: (id: string) => `/brands/${id}`,
    delete: (id: string) => `/brands/${id}`,
  },

  products: {
    list: '/products',
    create: '/products',
    detail: (id: string) => `/products/${id}`,
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    byCategory: (categoryId: string) => `/products/category/${categoryId}`,
    byBrand: (brandId: string) => `/products/brand/${brandId}`,
  },

  customers: {
    list: '/customers',
    create: '/customers',
    detail: (id: string) => `/customers/${id}`,
    update: (id: string) => `/customers/${id}`,
    delete: (id: string) => `/customers/${id}`,
    byEmail: (email: string) => `/customers/email/${email}`,
  },

  addresses: {
    list: '/addresses',
    create: '/addresses',
    detail: (id: string) => `/addresses/${id}`,
    update: (id: string) => `/addresses/${id}`,
    delete: (id: string) => `/addresses/${id}`,
    byCustomer: (customerId: string) => `/addresses/customer/${customerId}`,
  },

  orders: {
    list: '/orders',
    create: '/orders',
    detail: (id: string) => `/orders/${id}`,
    update: (id: string) => `/orders/${id}`,
    delete: (id: string) => `/orders/${id}`,
    byCustomer: (customerId: string) => `/orders/customer/${customerId}`,
  },

  orderItems: {
    list: '/order-items',
    create: '/order-items',
    createBulk: '/order-items/bulk',
    detail: (id: string) => `/order-items/${id}`,
    update: (id: string) => `/order-items/${id}`,
    delete: (id: string) => `/order-items/${id}`,
    byOrder: (orderId: string) => `/order-items/order/${orderId}`,
  },

  payments: {
    list: '/payments',
    create: '/payments',
    detail: (id: string) => `/payments/${id}`,
    update: (id: string) => `/payments/${id}`,
    delete: (id: string) => `/payments/${id}`,
    byOrder: (orderId: string) => `/payments/order/${orderId}`,
  },
}
