import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token on every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Auth ────────────────────────────────────────────────────────────────────
export const signup = (name, email, password) =>
  api.post('/api/auth/signup', { name, email, password })

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password })

// ─── Users ───────────────────────────────────────────────────────────────────
export const getMe = () => api.get('/api/users/me')

export const getAllInterests = () => api.get('/api/users/interests/all')

export const setInterests = (interest_ids) =>
  api.post('/api/users/interests', { interest_ids })

export const requestOrganizer = () => api.post('/api/users/request-organizer')

// ─── Events ──────────────────────────────────────────────────────────────────
export const getEvents     = ()    => api.get('/api/events/')

export const getCityEvents = ()    => api.get('/api/events/city')  // City branch only

export const getMyEvents   = ()    => api.get('/api/events/mine')

export const getFeed       = ()    => api.get('/api/events/feed')

export const getEvent = (id) => api.get(`/api/events/${id}`)

export const createEvent = (data) => api.post('/api/events/', data)

// ─── Passes ──────────────────────────────────────────────────────────────────
export const registerPass = (eventId) =>
  api.post(`/api/passes/${eventId}/register`)

export const getMyPasses = () => api.get('/api/passes/my')

// ─── Admin ───────────────────────────────────────────────────────────────────
export const getOrganizerRequests = () =>
  api.get('/api/admin/organizer-requests')

export const approveOrganizer = (id) =>
  api.post(`/api/admin/organizer-requests/${id}/approve`)

export const rejectOrganizer = (id) =>
  api.post(`/api/admin/organizer-requests/${id}/reject`)

export const getPendingEvents = () => api.get('/api/admin/events/pending')

export const approveEvent = (id) =>
  api.post(`/api/admin/events/${id}/approve`)

export const rejectEvent = (id) =>
  api.post(`/api/admin/events/${id}/reject`)

// ─── Fests ───────────────────────────────────────────────────────────────────
export const getFests        = ()             => api.get('/api/fests/')
export const getFest         = (slug)         => api.get(`/api/fests/${slug}`)
export const getFestEvents   = (slug)         => api.get(`/api/fests/${slug}/events`)
export const createFest      = (data)         => api.post('/api/fests/', data)
export const setFestStatus   = (slug, status) => api.patch(`/api/fests/${slug}/status`, { status })

// ─── Fest Members ─────────────────────────────────────────────────────────────
export const getFestMembers  = (slug)         => api.get(`/api/fests/${slug}/members`)
export const addFestMember   = (slug, data)   => api.post(`/api/fests/${slug}/members`, data)
export const removeFestMember = (slug, userId) => api.delete(`/api/fests/${slug}/members/${userId}`)

// ─── Colleges ────────────────────────────────────────────────────────────────
export const getColleges = () => api.get('/api/colleges/')

export const createCollege = (data) => api.post('/api/colleges/', data)

export const deleteCollege = (id) => api.delete(`/api/colleges/${id}`)

export default api
