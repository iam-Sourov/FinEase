import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../Supabase/supabase.config';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Format Supabase user to mimic Firebase user structure
    const formatUser = (sessionUser) => {
        if (!sessionUser) return null;
        return {
            ...sessionUser,
            uid: sessionUser.id,
            email: sessionUser.email,
            displayName: sessionUser.user_metadata?.display_name || 
                         sessionUser.user_metadata?.full_name || 
                         sessionUser.email.split('@')[0]
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
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
    };

    useEffect(() => {
        // Retrieve active session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session ? formatUser(session.user) : null);
            setLoading(false);
        }).catch((err) => {
            console.error("Error retrieving initial session:", err);
            setLoading(false);
        });

        // Listen for authentication changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session ? formatUser(session.user) : null);
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
