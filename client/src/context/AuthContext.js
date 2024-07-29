import React, {createContext, useState, useEffect} from 'react'
import axios from 'axios'

const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token
            axios.get('/api/auth').then(res => setUser(res.data))
            .catch(() => localStorage.removeItem('token'))
        }
        
    }, [])
    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', {email, password})
        localStorage.setItem('token', res.data.token)
        axios.defaults.headers.common['x-auth-token'] = res.data.token
        setUser(res.data.use)
    }
    const register = async (userData) => {
        const res = axios.post('/api/auth/register', userData)
        localStorage.setItem('token', res.data.token)
        axios.defaults.headers.common['x-auth-token'] = res.data.token
        setUser(res.data.user)
    }
    const logout = () => {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['x-auth-token']
        setUser(null)
    }
    return (
        <AuthContext.Provider value={{user, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export {AuthContext, AuthProvider}