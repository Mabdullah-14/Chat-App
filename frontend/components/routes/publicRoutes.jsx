import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from '../../Context/authContext'

const PublicRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
                    <p className="text-sm font-medium text-gray-500 animate-pulse">Verifying credentials...</p>
                </div>
            </div>
        );
    }

    return !user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoutes;
