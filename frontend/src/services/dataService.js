import api from './api';
import { toast } from 'react-hot-toast';

// ----------------------------
// Helper for catching errors
// ----------------------------
const handleError = (error) => {
  const message =
    error?.response?.data?.error || error.message || 'Something went wrong';
  toast.error(message);
  throw error;
};

// ----------------------------
// Courts Service
// ----------------------------
export const courtService = {
  getAll: async (params) => {
    try {
      const res = await api.get('/api/courts', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/api/courts/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/api/admin/courts', data);
      toast.success('Court created successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/api/admin/courts/${id}`, data);
      toast.success('Court updated successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/api/admin/courts/${id}`);
      toast.success('Court deleted successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  toggle: async (id) => {
    try {
      const res = await api.patch(`/api/admin/courts/${id}/toggle`);
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
      const res = await api.get('/api/coaches', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/api/coaches/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/api/admin/coaches', data);
      toast.success('Coach added successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/api/admin/coaches/${id}`, data);
      toast.success('Coach updated successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/api/admin/coaches/${id}`);
      toast.success('Coach deleted successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  toggle: async (id) => {
    try {
      const res = await api.patch(`/api/admin/coaches/${id}/toggle`);
      toast.success('Coach status updated');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  updateAvailability: async (id, availability) => {
    try {
      const res = await api.put(`/api/admin/coaches/${id}/availability`, {
        availability,
      });
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
      const res = await api.get('/api/equipment', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/api/equipment/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/api/admin/equipment', data);
      toast.success('Equipment added successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/api/admin/equipment/${id}`, data);
      toast.success('Equipment updated successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/api/admin/equipment/${id}`);
      toast.success('Equipment deleted successfully');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  toggle: async (id) => {
    try {
      const res = await api.patch(`/api/admin/equipment/${id}/toggle`);
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
      const res = await api.get('/api/pricing-rules', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/api/pricing-rules/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/api/admin/pricing-rules', data);
      toast.success('Pricing rule created');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/api/admin/pricing-rules/${id}`, data);
      toast.success('Pricing rule updated');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/api/admin/pricing-rules/${id}`);
      toast.success('Pricing rule deleted');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  toggle: async (id) => {
    try {
      const res = await api.patch(`/api/admin/pricing-rules/${id}/toggle`);
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
      const res = await api.get('/api/bookings', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/api/bookings/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getMyBookings: async (params) => {
    try {
      const res = await api.get('/api/bookings/my-bookings', { params });
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  getAvailableSlots: async (courtId, date) => {
    try {
      const res = await api.get(`/api/bookings/slots/${courtId}/${date}`);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  checkAvailability: async (data) => {
    try {
      const res = await api.post('/api/bookings/check-availability', data);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  calculatePrice: async (data) => {
    try {
      const res = await api.post('/api/bookings/calculate-price', data);
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/api/bookings', data);
      toast.success('Booking successful');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  cancel: async (id) => {
    try {
      const res = await api.patch(`/api/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
  joinWaitlist: async (data) => {
    try {
      const res = await api.post('/api/bookings/waitlist', data);
      toast.success('Added to waitlist');
      return res.data;
    } catch (err) {
      handleError(err);
    }
  },
};
