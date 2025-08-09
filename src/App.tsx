
import { Box } from '@mui/material';
import { useState } from 'react';
import { useFormStore } from './store/useFormStore';
import './App.css';
import { CreateForm } from './components/CreateForm';
import { MyForms } from './components/MyForms';
import FormPreview from './components/FormPreview';
import {Navigation} from './components/Navigation'

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState('/create');
  const store = useFormStore();

  const navigate = (route: string) => {
    setCurrentRoute(route);
  };

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case '/create':
        return <CreateForm store={store} onNavigate={navigate} />;
      case '/preview':
        return <FormPreview store={store} />;
      case '/myforms':
        return <MyForms store={store} onNavigate={navigate} />;
      default:
        return <CreateForm store={store} onNavigate={navigate} />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb' /* gray-50 */ }}>
      <Navigation currentRoute={currentRoute} onNavigate={navigate} />
      {renderCurrentRoute()}
    </Box>
  );
};

export default App;
