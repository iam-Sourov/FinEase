import React from 'react';

const FormInput = ({ name, label, type, placeholder }) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {label}
            </label>
            <input
                id={name}
                type={type}
                name={name}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-border/80 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all rounded-2xl text-sm"
            />
        </div>
    );
};

export default FormInput;