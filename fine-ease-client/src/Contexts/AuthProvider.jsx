import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../Supabase/supabase.config';
import toast from 'react-hot-toast';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Format Supabase user to mimic Firebase user structure
    const formatUser = (sessionUser) => {
        if (!sessionUser) return null;
        const name = sessionUser.user_metadata?.display_name || 
                     sessionUser.user_metadata?.full_name || 
                     sessionUser.email.split('@')[0];
        return {
            ...sessionUser,
            uid: sessionUser.id,
            email: sessionUser.email,
            displayName: name,
            photoURL: sessionUser.user_metadata?.avatar_url || 
                      sessionUser.user_metadata?.picture || 
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`
        };
    };

    const signUp = async (email, password, metadata = {}) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: metadata.name || '',
                        avatar_url: metadata.photoUrl || ''
                    }
                }
            });
            if (error) throw error;
            return { user: formatUser(data.user) };
        } finally {
            setLoading(false);
        }
    };

    const LogIn = async (email, password) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return { user: formatUser(data.user) };
        } finally {
            setLoading(false);
        }
    };

    const LogOut = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (updatedData) => {
        const { data, error } = await supabase.auth.updateUser({
            data: { 
                display_name: updatedData.displayName,
                avatar_url: updatedData.photoURL
            }
        });
        if (error) throw error;
        
        const formatted = formatUser(data.user);
        setUser(formatted);
        return formatted;
    };

    const GoogleLogin = async () => {
        setLoading(true);
        localStorage.setItem('show_oauth_toast', 'true');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) {
                localStorage.removeItem('show_oauth_toast');
                throw error;
            }
            return { user: null };
        } catch (err) {
            setLoading(false);
            throw err;
        }
    };

    useEffect(() => {
        let mounted = true;

        // Safety fallback timer to ensure loading state resolves even on slow networks
        const safetyTimer = setTimeout(() => {
            if (mounted) setLoading(false);
        }, 1500);

        const triggerOAuthToast = (session) => {
            if (session && localStorage.getItem('show_oauth_toast') === 'true') {
                localStorage.removeItem('show_oauth_toast');
                setTimeout(() => {
                    toast.success("Logged in successfully!");
                }, 600);
            }
        };

        // Retrieve active session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted) {
                setUser(session ? formatUser(session.user) : null);
                triggerOAuthToast(session);
                setLoading(false);
            }
        }).catch((err) => {
            console.error("Error retrieving initial session:", err);
            if (mounted) setLoading(false);
        });

        // Listen for authentication changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session ? formatUser(session.user) : null);
                triggerOAuthToast(session);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(safetyTimer);
            subscription?.unsubscribe();
        };
    }, []);

    const AuthInfo = {
        user,
        setUser,
        loading,
        setLoading,
        signUp,
        LogIn,
        LogOut,
        GoogleLogin,
        updateUser,
    };

    return (
        <AuthContext.Provider value={AuthInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
