import Register from "../../src/components/Register";
import { vi, expect, test } from "vitest"
import { screen, render, fireEvent } from "@testing-library/react"
import { MemoryRouter, useNavigate } from "react-router-dom";
import axios from "axios";


vi.mock('axios')


const mockSetUser = vi.fn()

const renderRegisterPage = () => {
    render(
        <MemoryRouter initialEntries={['/register']}>
            <Register setUser={mockSetUser} />
        </MemoryRouter>
    )
}

test('all input fields are visible and accept input', () => {
    renderRegisterPage()


    const username = screen.getByPlaceholderText(/Username/i)
    const email = screen.getByPlaceholderText(/email/i)
    const password = screen.getByPlaceholderText(/password/i)
    expect(username).toBeInTheDocument()
    expect(email).toBeInTheDocument()
    expect(password).toBeInTheDocument()

    fireEvent.change(username, {target: {value: 'test'}})
    expect(username.value).toBe('test')
    fireEvent.change(email, {target: {value: 'test@example.com'}})
    expect(email.value).toBe('test@example.com')
    fireEvent.change(password, {target: {value: 'pass1'}})
    expect(password.value).toBe('pass1')
})


test('Login option visible and points to login page', () => {
    renderRegisterPage()

    const loginLink = screen.getByRole('link', {name: /login/i})
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute('href', '/login')
})