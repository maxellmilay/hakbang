'use client'

import React from 'react'
import TextField from '@mui/material/TextField'

function Page() {
    return (
        <div className="w-full h-lvh overflow-none flex justify-center items-center p-2 bg-primary-light">
            <div className="w-full sm:w-[400px] py-4 px-6 border-2 border-black rounded-md flex flex-col gap-3 bg-white">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold">Lakb.</h1>
                    <div className="font-bold text-2xl flex w-9 h-9 bg-primary border-2 border-black rounded-md  justify-center items-center">
                        AI
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <h1 className="text-center text-3xl font-bold">
                        Welcome Back!
                    </h1>
                    <p className="text-sm text-slate-400 text-center">
                        Please enter login details bellow
                    </p>
                </div>
                <div className="flex flex-col gap-3 py-2">
                    <TextField
                        label="Email or Username"
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        size="small"
                        type="password"
                    />
                </div>
                <button
                    className="bg-primary text-black p-3 text-lg font-bold rounded-md border-2 border-black
                duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                >
                    Login
                </button>
                <p className="text-center">
                    Don&apos;t have an account?{' '}
                    <span className="text-primary-dark cursor-pointer">
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    )
}

export default Page
