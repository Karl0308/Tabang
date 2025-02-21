import React from 'react';
import LoadComponent from './component/LoadComponent';
import { fa0 } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">WELCOME TO TICKET APPLICATION</h1>
            <p className="text-lg text-gray-600 mb-6">Manage your tickets efficiently</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Featured Tickets</h2>
                    <div className="flex justify-center items-center h-32 border border-gray-200 rounded-lg">
                        {/* Replace this with your featured tickets content */}
                        <p className="text-gray-500">No featured tickets available</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Ticket Statistics</h2>
                    <div className="flex justify-center items-center h-32 border border-gray-200 rounded-lg">
                        {/* Replace this with your ticket statistics content */}
                        <p className="text-gray-500">523 Tickets Catered</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Tickets Assigned</h2>
                    <div className="flex justify-center items-center h-32 border border-gray-200 rounded-lg">
                        {/* Replace this with your assigned tickets content */}
                        <p className="text-gray-500">10 Current Open Tickets</p>
                        <p className="text-gray-500">32 Current In Progress Tickets</p>
                        <p className="text-gray-500">54 Current On Hold Tickets</p>
                        <p className="text-gray-500">543 Current Done Tickets</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="flex justify-center items-center h-32 border border-gray-200 rounded-lg">
                        {/* Replace this with your recent activity content */}
                        <p className="text-gray-500">123-ABC - Test Ticket Description</p>
                        <p className="text-gray-500">123-ABC - Test Ticket Description</p>
                        <p className="text-gray-500">123-ABC - Test Ticket Description</p>
                        <p className="text-gray-500">123-ABC - Test Ticket Description</p>
                        <p className="text-gray-500">123-ABC - Test Ticket Description</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Star Ratings</h2>
                    <div className="flex justify-center items-center h-32 border border-gray-200 rounded-lg">
                        <p className="text-gray-500">5 Star</p>
                        <p className="text-gray-500">4 Star</p>
                        <p className="text-gray-500">3 Star</p>
                        <p className="text-gray-500">2 Star</p>
                        <p className="text-gray-500">1 Star</p>
                        <p className="text-gray-500">Average Star Ratings</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Response Time Average</h2>
                    <div className="flex justify-center items-center h-32 border border-gray-200 rounded-lg">
                        <p className="text-gray-500">1 Hour 32 Minutes Average Reponse Time</p>
                    </div>
                </div>
            </div>
            <LoadComponent loading={false}  />
        </div>
    );
};

export default Home;
