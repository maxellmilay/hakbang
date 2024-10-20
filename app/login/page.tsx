/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import TextField from '@mui/material/TextField'
import useAuthStore from '@/store/auth'

function Page() {
    const { user, login, logout } = useAuthStore()
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [incorrect, setIncorrect] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMaxAttempt, setHasMaxAttempt] = useState(false)

    const clearFailedLogin = () => {
        localStorage.setItem('failedLoginCount', '0')
    }

    const checkFailedLogin = () => {
        const maxAttempt = 10000 // this is temporary
        const count = localStorage.getItem('failedLoginCount')
        if (count === null) {
            clearFailedLogin()
            return true
        }
        if (parseInt(count) >= maxAttempt) {
            return false
        }
        return true
    }

    const incrementFailedLogin = () => {
        const count = localStorage.getItem('failedLoginCount')
        if (count === null) {
            localStorage.setItem('failedLoginCount', '1')
            return
        }
        localStorage.setItem(
            'failedLoginCount',
            (parseInt(count) + 1).toString()
        )
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!checkFailedLogin()) {
            console.error('Max attempt reached')
            setHasMaxAttempt(true)
            return
        }
        if (username.trim() === '' || password.trim() === '') {
            console.error('Username or password is empty')
            setIncorrect(true)
            return
        }
        setIsLoading(true)
        try {
            await login(username, password)
            clearFailedLogin()
            router.push('/')
        } catch (error) {
            console.log('hereee')
            console.error(error)
            incrementFailedLogin()
            setIncorrect(true)
            setIsLoading(false)
        }
    }

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
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 py-2">
                        <TextField
                            label="Username"
                            variant="outlined"
                            size="small"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            size="small"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {incorrect && !isLoading && (
                            <p className="text-red-500 text-sm">
                                Incorrect username or password
                            </p>
                        )}
                        {hasMaxAttempt && (
                            <p className="text-red-500 text-sm">
                                You have reached the maximum attempt
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`bg-primary text-black p-3 text-lg font-bold rounded-md border-2 border-black
                duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>
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
