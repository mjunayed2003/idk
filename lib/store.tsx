'use client';
import React, { useRef } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Provider } from 'react-redux';

// API Slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3001',
    prepareHeaders: (headers) => {
      // Get token from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      }
      return headers;
    }
  }),
  tagTypes: ['Customers', 'Draws', 'Settings'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Customers
    getActiveCustomers: builder.query<import('./types').Customer[], void>({
      query: () => 'customer/active',
      providesTags: ['Customers'],
    }),
    getAllCustomers: builder.query<import('./types').Customer[], void>({
      query: () => 'customer',
      providesTags: ['Customers'],
    }),
    addCustomer: builder.mutation<import('./types').Customer, any>({
      query: (customer) => ({
        url: 'customer',
        method: 'POST',
        body: customer,
      }),
      invalidatesTags: ['Customers'],
    }),
    deleteCustomer: builder.mutation<any, string>({
      query: (id) => ({
        url: `customer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customers'],
    }),

    // Draw
    runDraw: builder.mutation<any, void>({
      query: () => ({
        url: 'draw/run',
        method: 'POST',
      }),
    }),
    saveDrawResult: builder.mutation<any, any>({
      query: (data) => ({
        url: 'draw/save',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Draws', 'Customers', 'Settings'],
    }),
    getDrawHistory: builder.query<import('./types').Draw[], void>({
      query: () => 'draw/history',
      providesTags: ['Draws'],
    }),

    // Settings
    getNextDrawDate: builder.query<{date: string}, void>({
      query: () => 'setting/next-draw',
      providesTags: ['Settings'],
    }),
    setNextDrawDate: builder.mutation<any, string>({
      query: (date) => ({
        url: 'setting/next-draw',
        method: 'POST',
        body: { date },
      }),
      invalidatesTags: ['Settings'],
    }),
    getPrizes: builder.query<import('./types').PrizeConfig, void>({
      query: () => 'setting/prizes',
      providesTags: ['Settings'],
    }),
    setPrizes: builder.mutation<any, import('./types').PrizeConfig>({
      query: (prizes) => ({
        url: 'setting/prizes',
        method: 'POST',
        body: prizes,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetActiveCustomersQuery,
  useGetAllCustomersQuery,
  useAddCustomerMutation,
  useDeleteCustomerMutation,
  useRunDrawMutation,
  useSaveDrawResultMutation,
  useGetDrawHistoryQuery,
  useGetNextDrawDateQuery,
  useSetNextDrawDateMutation,
  useGetPrizesQuery,
  useSetPrizesMutation,
} = api;

// Store setup
export const makeStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Provider Component
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
