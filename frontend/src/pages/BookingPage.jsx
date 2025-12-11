import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { FiCalendar, FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  courtService,
  coachService,
  equipmentService,
  bookingService,
} from '../services/dataService';
import CourtCard from '../components/CourtCard';
import TimeSlotGrid from '../components/TimeSlotGrid';
import CoachCard from '../components/CoachCard';
import EquipmentSelector from '../components/EquipmentSelector';
import PriceBreakdown from '../components/PriceBreakdown';
import Loading from '../components/Loading';

const BookingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Data
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [slots, setSlots] = useState([]);

  // Selection
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  // Pricing
  const [pricing, setPricing] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  // Loading & Steps
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courtsRes, coachesRes, equipmentRes] = await Promise.all([
          courtService.getAll({ isActive: true }),
          coachService.getAll({ isActive: true }),
          equipmentService.getAll({ isActive: true }),
        ]);
        setCourts(courtsRes?.data || []);
        setCoaches(coachesRes?.data || []);
        setEquipment(equipmentRes?.data || []);
      } catch {
        toast.error('Failed to load booking data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch available slots
  useEffect(() => {
    let isMounted = true;
    if (!selectedCourt || !selectedDate) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const response = await bookingService.getAvailableSlots(
          selectedCourt?._id,
          selectedDate
        );
        if (isMounted) setSlots(response?.data || []);
      } catch {
        if (isMounted) toast.error('Failed to load time slots');
      } finally {
        if (isMounted) setSlotsLoading(false);
      }
    };

    fetchSlots();
    setSelectedSlot(null);

    return () => {
      isMounted = false;
    };
  }, [selectedCourt, selectedDate]);

  // Calculate price
  const calculatePrice = useCallback(async () => {
    if (!selectedCourt || !selectedSlot) return setPricing(null);

    setPricingLoading(true);
    try {
      const response = await bookingService.calculatePrice({
        courtId: selectedCourt?._id,
        coachId: selectedCoach?._id,
        equipment: (selectedEquipment || []).filter((e) => e.quantity > 0),
        date: selectedDate,
        startTime: selectedSlot?.startTime,
        endTime: selectedSlot?.endTime,
      });
      setPricing(response?.data || null);
    } catch {
      console.error('Price calculation failed');
      setPricing(null);
    } finally {
      setPricingLoading(false);
    }
  }, [selectedCourt, selectedSlot, selectedCoach, selectedEquipment, selectedDate]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  // Equipment update
  const handleEquipmentUpdate = (equipmentId, quantity) => {
    setSelectedEquipment((prev) => {
      const existing = (prev || []).find((e) => e.equipmentId === equipmentId);
      if (existing) {
        if (quantity === 0) return prev.filter((e) => e.equipmentId !== equipmentId);
        return prev.map((e) => (e.equipmentId === equipmentId ? { ...e, quantity } : e));
      }
      return [...(prev || []), { equipmentId, quantity }];
    });
  };

  // Coach toggle
  const handleCoachToggle = (coach) => {
    setSelectedCoach((prev) => (prev?._id === coach._id ? null : coach));
  };

  // Submit booking
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book');
      navigate('/login');
      return;
    }

    if (!selectedCourt || !selectedSlot) {
      toast.error('Select a court and time slot first');
      return;
    }

    setSubmitting(true);
    try {
      await bookingService.create({
        courtId: selectedCourt?._id,
        coachId: selectedCoach?._id,
        equipment: (selectedEquipment || []).filter((e) => e.quantity > 0),
        date: selectedDate,
        startTime: selectedSlot?.startTime,
        endTime: selectedSlot?.endTime,
      });
      toast.success('Booking confirmed!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Dates
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE, MMM d'),
    };
  });

  if (loading) return <Loading text="Loading booking options..." />;

  const steps = [
    { number: 1, title: 'Select Court' },
    { number: 2, title: 'Choose Time' },
    { number: 3, title: 'Add Options' },
    { number: 4, title: 'Confirm' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-graphite">Book a Court</h1>
        <p className="text-mutedCharcoal mt-2">
          Select your court, time, and optional add-ons
        </p>
      </div>

      {/* Step Progress */}
      <div className="mb-8 flex items-center justify-between max-w-2xl">
        {(steps || []).map((step, index) => (
          <div key={step.number} className="flex items-center">
            <button
              onClick={() => setCurrentStep(step.number)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                currentStep >= step.number
                  ? 'bg-primary-600 text-frostWhite'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > step.number ? <FiCheck /> : step.number}
            </button>
            <span
              className={`ml-2 hidden sm:block ${
                currentStep >= step.number
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-1 mx-2 rounded ${
                  currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1 */}
          {currentStep >= 1 && (
            <section>
              <h2 className="text-xl font-semibold text-graphite mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  1
                </span>
                Select a Court
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {(courts || []).map((court) => (
                  <CourtCard
                    key={court._id}
                    court={court}
                    selected={selectedCourt}
                    onSelect={(court) => {
                      setSelectedCourt(court);
                      setCurrentStep(Math.max(currentStep, 2));
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Step 2 */}
          {currentStep >= 2 && selectedCourt && (
            <section>
              <h2 className="text-xl font-semibold text-graphite mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  2
                </span>
                Choose Date & Time
              </h2>

              <div className="mb-6">
                <label className="label flex items-center">
                  <FiCalendar className="mr-2" /> Select Date
                </label>
                <div className="flex flex-wrap gap-2">
                  {(dateOptions || []).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedDate(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedDate === option.value
                          ? 'bg-primary-600 text-frostWhite'
                          : 'bg-frostWhite border border-paleSteel text-graphite hover:border-primary-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label flex items-center mb-3">
                  <FiClock className="mr-2" /> Available Time Slots
                </label>
                <TimeSlotGrid
                  slots={slots || []}
                  selectedSlot={selectedSlot}
                  onSelectSlot={(slot) => {
                    setSelectedSlot(slot);
                    setCurrentStep(Math.max(currentStep, 3));
                  }}
                  loading={slotsLoading}
                />
              </div>
            </section>
          )}

          {/* Step 3 */}
          {currentStep >= 3 && selectedSlot && (
            <section>
              <h2 className="text-xl font-semibold text-graphite mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  3
                </span>
                Add Options (Optional)
              </h2>

              <div className="mb-6">
                <h3 className="font-medium text-graphite mb-3">Book a Coach</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(coaches || []).map((coach) => (
                    <CoachCard
                      key={coach._id}
                      coach={coach}
                      selected={selectedCoach}
                      onToggle={handleCoachToggle}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-graphite mb-3">Rent Equipment</h3>
                <EquipmentSelector
                  equipment={equipment || []}
                  selectedEquipment={selectedEquipment || []}
                  onUpdateQuantity={handleEquipmentUpdate}
                />
              </div>

              <button
                onClick={() => setCurrentStep(4)}
                className="mt-6 btn btn-primary"
              >
                Continue to Review
              </button>
            </section>
          )}

          {/* Step 4 */}
          {currentStep >= 4 && (
            <section>
              <h2 className="text-xl font-semibold text-graphite mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  4
                </span>
                Review & Confirm
              </h2>

              <div className="card space-y-4">
                <h3 className="font-semibold text-lg">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  {selectedCourt && (
                    <div className="flex justify-between">
                      <span className="text-mutedCharcoal">Court</span>
                      <span className="font-medium">
                        {selectedCourt?.name} ({selectedCourt?.type})
                      </span>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-mutedCharcoal">Date</span>
                      <span className="font-medium">
                        {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  {selectedSlot && (
                    <div className="flex justify-between">
                      <span className="text-mutedCharcoal">Time</span>
                      <span className="font-medium">
                        {selectedSlot.startTime} - {selectedSlot.endTime}
                      </span>
                    </div>
                  )}
                  {selectedCoach && (
                    <div className="flex justify-between">
                      <span className="text-mutedCharcoal">Coach</span>
                      <span className="font-medium">{selectedCoach.name}</span>
                    </div>
                  )}
                  {(selectedEquipment || [])
                    .filter((e) => e.quantity > 0)
                    .map((item) => {
                      const eq = (equipment || []).find(
                        (e) => e._id === item.equipmentId
                      );
                      return (
                        <div
                          key={item.equipmentId}
                          className="flex justify-between text-sm"
                        >
                          <span>{eq?.name || 'Unknown'}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      );
                    })}
                </div>

                {!isAuthenticated && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex items-start">
                    <FiAlertCircle className="text-yellow-600 mr-2 mt-0.5 shrink-0" />
                    <p className="text-sm text-yellow-800">
                      Please{' '}
                      <button
                        onClick={() => navigate('/login')}
                        className="underline font-medium"
                      >
                        log in
                      </button>{' '}
                      or{' '}
                      <button
                        onClick={() => navigate('/register')}
                        className="underline font-medium"
                      >
                        create an account
                      </button>{' '}
                      to complete your booking.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !isAuthenticated}
                  className="mt-6 btn btn-primary w-full py-3 text-lg"
                >
                  {submitting
                    ? 'Processing...'
                    : `Confirm Booking - $${pricing?.total?.toFixed(2) || '0.00'}`}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <PriceBreakdown pricing={pricing} loading={pricingLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
