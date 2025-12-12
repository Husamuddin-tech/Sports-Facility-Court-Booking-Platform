import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  FiGrid,
  FiUsers,
  FiPackage,
  FiDollarSign,
  FiCalendar,
  FiPlus,
} from 'react-icons/fi';
import Loading from '../components/Loading';
import CourtsTable from '../components/admin-tables/CourtsTable.jsx';
import CoachesTable from '../components/admin-tables/CoachesTable.jsx';
import EquipmentTable from '../components/admin-tables/EquipmentTable.jsx';
import PricingTable from '../components/admin-tables/PricingTable.jsx';
import BookingsTable from '../components/admin-tables/BookingsTable.jsx';
import AdminModal from '../components/AdminModal.jsx'; // ✅ Added import
import {
  courtService,
  coachService,
  equipmentService,
  pricingRuleService,
  bookingService,
} from '../services/dataService';

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState('courts');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const tabs = [
    { id: 'courts', label: 'Courts', icon: <FiGrid /> },
    { id: 'coaches', label: 'Coaches', icon: <FiUsers /> },
    { id: 'equipment', label: 'Equipment', icon: <FiPackage /> },
    { id: 'pricing', label: 'Pricing Rules', icon: <FiDollarSign /> },
    { id: 'bookings', label: 'All Bookings', icon: <FiCalendar /> },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let service;
      switch (activeTab) {
        case 'courts':
          service = courtService;
          break;
        case 'coaches':
          service = coachService;
          break;
        case 'equipment':
          service = equipmentService;
          break;
        case 'pricing':
          service = pricingRuleService;
          break;
        case 'bookings':
          service = bookingService;
          break;
        default:
          service = null;
      }

      if (!service) return;

      const response = await service.getAll();
      setData(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const tableProps = useMemo(
    () => ({
      data,
      loading,
      onEdit: handleEdit,
      onRefresh: fetchData,
    }),
    [data, loading, fetchData]
  );

  const renderTable = () => {
    if (loading) return <Loading text="Loading..." />;

    switch (activeTab) {
      case 'courts':
        return <CourtsTable {...tableProps} />;
      case 'coaches':
        return <CoachesTable {...tableProps} />;
      case 'equipment':
        return <EquipmentTable {...tableProps} />;
      case 'pricing': {
        const pricingList = (data || []).map((p, index) => ({
          bookingName: p.name || `Rule #${index + 1}`,
          courtPrice: p.courtPrice || 0,
          coachPrice: p.coachPrice || 0,
          equipmentPrice: p.equipmentPrice || 0,
          total: p.total || 0,
        }));
        return <PricingTable pricingList={pricingList} loading={loading} />;
      }
      case 'bookings':
        return <BookingsTable {...tableProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage courts, coaches, equipment, pricing rules, and bookings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          {activeTab !== 'bookings' && (
            <button
              onClick={handleAdd}
              className="btn btn-primary flex items-center"
            >
              <FiPlus className="mr-2" /> Add New
            </button>
          )}
        </div>

        <div className="overflow-x-auto">{renderTable()}</div>
      </div>

      {/* Modal */}
      {showModal && (
        <AdminModal
          entity={activeTab}
          item={editingItem}
          onClose={handleModalClose}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default AdminDashBoard;
