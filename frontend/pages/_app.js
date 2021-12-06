import 'tailwindcss/tailwind.css'
import toast, { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            border: '1px solid #fff',
            padding: '16px',
            color: 'white',
            background: 'rgb(110, 170, 250)',
            fontWeight: 'bold'
          },
          success: {
            style: {
              background: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
            },
          }
        }}
      />
    </div>
  )
}

export default MyApp