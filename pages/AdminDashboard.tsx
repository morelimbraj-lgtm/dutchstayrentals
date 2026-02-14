
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Property, User, UserRole, PropertyStatus } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg p-6">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
    </div>
);


const AdminDashboard: React.FC = () => {
    const {
        properties,
        enquiries,
        users,
        updatePropertyStatus,
        updateUserStatus,
        addUser,
        seedDatabase
    } = useData();

    const [activeTab, setActiveTab] = useState('overview');
    const [isSeeding, setIsSeeding] = useState(false);

    // Add Owner Modal State
    const [isAddOwnerModalOpen, setIsAddOwnerModalOpen] = useState(false);
    const [newOwnerEmail, setNewOwnerEmail] = useState('');
    const [newOwnerName, setNewOwnerName] = useState('');

    const owners = useMemo(() => users.filter(u => u.role === UserRole.OWNER), [users]);

    const handlePropertyStatusToggle = (property: Property) => {
        const newStatus = property.status === PropertyStatus.ACTIVE ? PropertyStatus.INACTIVE : PropertyStatus.ACTIVE;
        updatePropertyStatus(property.id, newStatus);
    };

    const handleOwnerStatusToggle = (owner: User) => {
        if (owner.status) {
            const newStatus = owner.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
            updateUserStatus(owner.id, newStatus);
        }
    };

    const handleAddOwner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newOwnerEmail && newOwnerName) {
            await addUser(newOwnerEmail, newOwnerName);
            setIsAddOwnerModalOpen(false);
            setNewOwnerEmail('');
            setNewOwnerName('');
        }
    };

    const handleSeed = async () => {
        if (window.confirm("This will add mock data to your Firestore database. Continue?")) {
            setIsSeeding(true);
            try {
                await seedDatabase();
                alert("Database seeded successfully!");
            } catch (e) {
                alert("Failed to seed database.");
            }
            setIsSeeding(false);
        }
    }

    const renderOverview = () => (
        <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Properties" value={properties.length} />
                <StatCard title="Total Enquiries" value={enquiries.length} />
                <StatCard title="Total Owners" value={owners.length} />
            </div>

        </div>
    );

    const renderProperties = () => (
        <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-2xl font-semibold">All Properties</h2>
            <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/20">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Property</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Owner</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {properties.map((property) => {
                            const owner = owners.find(o => o.id === property.ownerId);
                            return (
                                <tr key={property.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{property.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{owner?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === PropertyStatus.ACTIVE ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                            {property.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => handlePropertyStatusToggle(property)} className="text-indigo-400 hover:text-indigo-300">
                                            {property.status === PropertyStatus.ACTIVE ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderEnquiries = () => (
        <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-2xl font-semibold">All Enquiries</h2>
            <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg">
                <ul role="list" className="divide-y divide-white/10">
                    {enquiries.map((enquiry) => {
                        const property = properties.find(p => p.id === enquiry.propertyId);
                        return (
                            <li key={enquiry.id} className="p-4 sm:p-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="font-semibold text-indigo-400 text-sm">Property: {property?.title || 'N/A'}</p>
                                    <p className="mt-1 text-md font-semibold text-white">{enquiry.tenantName} ({enquiry.tenantEmail})</p>
                                    <p className="text-xs text-gray-400">Received: {new Date(enquiry.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/20 text-blue-300">
                                    {enquiry.status}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );

    const renderOwners = () => (
        <div className="space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Property Owners</h2>
                <Button onClick={() => setIsAddOwnerModalOpen(true)}>Authorize New Owner</Button>
            </div>

            <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/20">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {owners.map((owner) => (
                            <tr key={owner.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{owner.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{owner.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${owner.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {owner.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleOwnerStatusToggle(owner)} className="text-red-400 hover:text-red-300">
                                        {owner.status === 'ACTIVE' ? 'Block' : 'Approve'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'properties': return renderProperties();
            case 'enquiries': return renderEnquiries();
            case 'owners': return renderOwners();
            case 'overview':
            default:
                return renderOverview();
        }
    }

    const tabs = ['overview', 'properties', 'enquiries', 'owners'];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <div>
                <div className="border-b border-white/10">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`capitalize whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="pt-8">{renderContent()}</div>
            </div>

            <Modal
                isOpen={isAddOwnerModalOpen}
                onClose={() => setIsAddOwnerModalOpen(false)}
                title="Authorize New Owner"
            >
                <form onSubmit={handleAddOwner} className="space-y-4">
                    <p className="text-sm text-gray-400">
                        Add the Google Gmail address of the owner you wish to authorize. They will be able to log in immediately.
                    </p>
                    <Input
                        id="newOwnerName"
                        label="Owner Name"
                        value={newOwnerName}
                        onChange={(e) => setNewOwnerName(e.target.value)}
                        required
                    />
                    <Input
                        id="newOwnerEmail"
                        type="email"
                        label="Google Email Address"
                        value={newOwnerEmail}
                        onChange={(e) => setNewOwnerEmail(e.target.value)}
                        required
                        placeholder="example@gmail.com"
                    />
                    <div className="pt-2">
                        <Button type="submit" fullWidth>Authorize Owner</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
