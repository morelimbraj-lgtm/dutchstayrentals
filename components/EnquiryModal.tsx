
import React, { useState } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  onSubmit: (enquiryData: { name: string; email: string; phone?: string; message: string }) => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, propertyTitle, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    onSubmit({ name, email, phone, message });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Enquiry for ${propertyTitle}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          type="text"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="email"
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="phone"
          type="tel"
          label="Phone (Optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2 transition"
                required
            ></textarea>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="pt-2">
          <Button type="submit" fullWidth>
            Send Enquiry
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EnquiryModal;
