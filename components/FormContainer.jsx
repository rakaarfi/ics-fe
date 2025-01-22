'use client';

import React, { forwardRef } from 'react';

const FormContainer = forwardRef(({ children, title, error }, ref) => {
    return (
        <div className="container mx-auto p-4 font-jkt" ref={ref}>

            {error && <p className="text-red-500">{error}</p>}

            <div className="justify-center items-center min-h-screen min-w-screen">
                <div className="border rounded-3xl p-4 shadow-lg dark:bg-[#12171c] bg-[#ffffff] dark:border-0">
                    <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
                    {children}
                </div>
            </div>
        </div>
    );
});

export default FormContainer;