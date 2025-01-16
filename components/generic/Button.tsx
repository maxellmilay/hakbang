import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    className: string
    onClick: () => void
}

const Button = (props: ButtonProps) => {
    const { children, className, onClick } = props
    return (
        <button
            className={`px-5 py-3 border-2 border-black rounded-xl font-semibold hover:scale-110 duration-200 ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button
