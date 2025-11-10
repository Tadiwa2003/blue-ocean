import { useState, useEffect } from 'react';
import api from '../services/api.js';

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('💆 Fetching services from API...');
        const response = await api.services.getServices();
        console.log('💆 Services response:', response.success ? `✅ ${response.data?.services?.length || 0} services` : '❌ Failed');
        if (response.success) {
          const servicesList = response.data.services || [];
          setServices(servicesList);
          console.log('💆 Services loaded:', servicesList.length);
        } else {
          setError('Failed to load services');
        }
      } catch (err) {
        console.error('❌ Error fetching services:', err);
        setError(err.message || 'Failed to load services');
        // Fallback to empty array on error
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
}

export default useServices;

