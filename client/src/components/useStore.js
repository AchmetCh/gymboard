import {create} from 'zustand'
import axios from 'axios'
import api from '../api'
import { jwtDecode } from 'jwt-decode';

const useUserStore = create((set) => ({
    users: [],
    currentUser: null,
    loading: true,
    setUsers: (users) => set({ users }),
    setCurrentUser: (user) => set({ currentUser: user }),
  
    getAllUsers: async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api}/users`, {
          headers: {
            'x-auth-token': token,
          },
        });
  
        set({ users: response.data });
        
        // Decode the token to get the current user's ID
        const decodedToken = jwtDecode(token);
        const currentUserId = decodedToken.user.id;
        
        const currentUser = response.data.find(user => user._id === currentUserId);
        set({ currentUser });
      
      } catch (error) {
        console.error(error);
      }
      finally {
        set({ loading: false });
      }
    },

  }));
export default useUserStore;