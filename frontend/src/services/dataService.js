// services/dataService.js
import api from './api';
import { toast } from 'react-hot-toast';

// ----------------------------
// Helper for catching errors
// ----------------------------
const handleError = (error) => {
  const message = error?.response?.data?.error || error.message || 'Something went wrong';
  toast.error(message);
  throw error;
};

// ----------------------------
// Courts Service
// ----------------------------
export const courtService = {
  getAll: async (params) => {
    try {
      const res = await api.get('/courts', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/courts/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/admin/courts', data);
      toast.success('Court created successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/admin/courts/${id}`, data);
      toast.success('Court updated successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/admin/courts/${id}`);
      toast.success('Court deleted successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  toggle: async (id) => {
    try {
      const res = await api.patch(`/admin/courts/${id}/toggle`);
      toast.success('Court status updated');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
};

// ----------------------------
// Coaches Service
// ----------------------------
export const coachService = {
  getAll: async (params) => {
    try {
      const res = await api.get('/coaches', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/coaches/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/admin/coaches', data);
      toast.success('Coach added successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/admin/coaches/${id}`, data);
      toast.success('Coach updated successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/admin/coaches/${id}`);
      toast.success('Coach deleted successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  toggle: async (id) => {
    try {
      const res = await api.patch(`/admin/coaches/${id}/toggle`);
      toast.success('Coach status updated');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  updateAvailability: async (id, availability) => {
    try {
      const res = await api.put(`/admin/coaches/${id}/availability`, { availability });
      toast.success('Coach availability updated');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
};

// ----------------------------
// Equipment Service
// ----------------------------
export const equipmentService = {
  getAll: async (params) => {
    try {
      const res = await api.get('/equipment', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/equipment/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/admin/equipment', data);
      toast.success('Equipment added successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/admin/equipment/${id}`, data);
      toast.success('Equipment updated successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/admin/equipment/${id}`);
      toast.success('Equipment deleted successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  toggle: async (id) => {
    try {
      const res = await api.patch(`/admin/equipment/${id}/toggle`);
      toast.success('Equipment status updated');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
};

// ----------------------------
// Pricing Rules Service
// ----------------------------
export const pricingRuleService = {
  getAll: async (params) => {
    try {
      const res = await api.get('/pricing-rules', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/pricing-rules/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/admin/pricing-rules', data);
      toast.success('Pricing rule created');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/admin/pricing-rules/${id}`, data);
      toast.success('Pricing rule updated');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/admin/pricing-rules/${id}`);
      toast.success('Pricing rule deleted');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  toggle: async (id) => {
    try {
      const res = await api.patch(`/admin/pricing-rules/${id}/toggle`);
      toast.success('Pricing rule status updated');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
};

// ----------------------------
// Booking Service
// ----------------------------
export const bookingService = {
  getAll: async (params) => {
    try {
      const res = await api.get('/bookings', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/bookings/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getMyBookings: async (params) => {
    try {
      const res = await api.get('/bookings/my-bookings', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getAvailableSlots: async (courtId, date) => {
    try {
      const res = await api.get(`/bookings/slots/${courtId}/${date}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  checkAvailability: async (data) => {
    try {
      const res = await api.post('/bookings/check-availability', data);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  calculatePrice: async (data) => {
    try {
      const res = await api.post('/bookings/calculate-price', data);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/bookings', data);
      toast.success('Booking successful');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  cancel: async (id) => {
    try {
      const res = await api.patch(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  joinWaitlist: async (data) => {
    try {
      const res = await api.post('/bookings/waitlist', data);
      toast.success('Added to waitlist');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
};
