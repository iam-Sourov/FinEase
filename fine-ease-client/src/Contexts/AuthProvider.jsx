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

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        return { user: formatUser(data.user) };
    };

    const LogIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return { user: formatUser(data.user) };
    };

    const LogOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const updateUser = async (updatedData) => {
        const { data, error } = await supabase.auth.updateUser({
            data: { display_name: updatedData.displayName }
        });
        if (error) throw error;
        
        const formatted = formatUser(data.user);
        setUser(formatted);
        return formatted;
    };

    const GoogleLogin = async () => {
        setLoading(true);
        localStorage.setItem('show_oauth_toast', 'true');
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
    };

    useEffect(() => {
        const triggerOAuthToast = (session) => {
            if (session && localStorage.getItem('show_oauth_toast') === 'true') {
                localStorage.removeItem('show_oauth_toast');
                setTimeout(() => {
                    toast.success("Logged in with Google successfully!");
                }, 600);
            }
        };

        // Retrieve active session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session ? formatUser(session.user) : null);
            triggerOAuthToast(session);
            setLoading(false);
        }).catch((err) => {
            console.error("Error retrieving initial session:", err);
            setLoading(false);
        });

        // Listen for authentication changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session ? formatUser(session.user) : null);
            triggerOAuthToast(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
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
