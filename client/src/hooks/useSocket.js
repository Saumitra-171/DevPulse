import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { connectSocket, disconnectSocket } from '../services/socket';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const socket = connectSocket(accessToken);

    socket.on('activity:new', (event) => {
      window.dispatchEvent(new CustomEvent('activity:new', { detail: event }));
    });

    socket.on('notification:new', (notification) => {
      toast(notification.title, { icon: '🔔' });
    });

    return () => { disconnectSocket(); };
  }, [accessToken]);
};