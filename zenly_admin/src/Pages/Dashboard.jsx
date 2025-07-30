import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../hooks/Auth/useLogin';

function Dashboard() {
    const navigate = useNavigate();
    const { user, logout, loading } = useLoginStore();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '8px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #eee'
                }}>
                    <h1 style={{ margin: 0, color: '#333' }}>Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Logging out...' : 'Logout'}
                    </button>
                </div>

                {user && (
                    <div style={{
                        background: '#f8f9fa',
                        padding: '20px',
                        borderRadius: '6px',
                        marginBottom: '20px'
                    }}>
                        <h2 style={{ margin: '0 0 15px 0', color: '#495057' }}>
                            Welcome, {user.name} {user.surename}!
                        </h2>
                        <div style={{ display: 'grid', gap: '10px' }}>
                            <div><strong>Username:</strong> {user.username}</div>
                            <div><strong>Status:</strong> 
                                <span style={{
                                    color: user.status ? '#28a745' : '#dc3545',
                                    marginLeft: '5px'
                                }}>
                                    {user.status ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div><strong>Account Created:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    <div style={{
                        background: '#e3f2fd',
                        padding: '20px',
                        borderRadius: '6px',
                        border: '1px solid #bbdefb'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Quick Stats</h3>
                        <p style={{ margin: 0, color: '#424242' }}>
                            Your admin dashboard is ready. Add more features and statistics here.
                        </p>
                    </div>

                    <div style={{
                        background: '#f3e5f5',
                        padding: '20px',
                        borderRadius: '6px',
                        border: '1px solid #e1bee7'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>Recent Activity</h3>
                        <p style={{ margin: 0, color: '#424242' }}>
                            No recent activity to display.
                        </p>
                    </div>

                    <div style={{
                        background: '#e8f5e8',
                        padding: '20px',
                        borderRadius: '6px',
                        border: '1px solid #c8e6c9'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>System Status</h3>
                        <p style={{ margin: 0, color: '#424242' }}>
                            All systems are running normally.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 