import Layout from './src/components/layout/Layout';
import { AppProvider } from './src/components/context/app-provider';
import './App.css';

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
