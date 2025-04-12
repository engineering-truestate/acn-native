import React, { useState } from 'react';
import BusinessDetailsModal from '../components/Billing/BusinessDetailsModal';
import BillingContainer from '../components/Billing/BillingContainer';

export default function Billings() {
  const [showModal, setShowModal] = useState(false);
  const openBusinessModal = () => setShowModal(true);

  return (
    <>
      <BillingContainer onOpenBusinessModal={openBusinessModal} />

      <BusinessDetailsModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}