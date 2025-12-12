const AdminModal = ({ entity, item, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {item ? 'Edit' : 'Add New'} {entity}
        </h2>
        <p>Modal form goes here...</p>
        <button onClick={onClose} className="mt-4 btn btn-secondary">
          Close
        </button>
      </div>
    </div>
  );
};
export default AdminModal;
