
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import Profile from '../../src/components/Profile'
import { vi } from 'vitest'
import axios from 'axios'


vi.mock('axios')

const mockNavigate = vi.fn()



vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})


const mockUser = {
    username: 'test',
    email: 'test@example.com'
}
const mockSetUser = vi.fn()


const renderProfile = () => {
    return render(
        <BrowserRouter>
         <Profile user={mockUser} setUser={mockSetUser} />
        </BrowserRouter>
    )
}





test('renders user profile information', () => {
    renderProfile()

    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
})



test('change password button initially and then shows password input', () => {
    renderProfile()

    
    expect(screen.getByRole('button', {name: /change password/i})).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {name: /change password/i}))


    expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /save/i})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /cancel/i})).toBeInTheDocument()


})



test('updates input value and calls api when save clicked', async () => {
    renderProfile()

    fireEvent.click(screen.getByRole('button', {name: /change password/i}))


    const input = screen.getByPlaceholderText(/new password/i)
    fireEvent.change(input, {target: { value: 'newPassword123' }})

    expect(input.value).toBe('newPassword123')


    localStorage.setItem('token', 'fake-token')

    axios.put.mockResolvedValue({ data:{} })

    fireEvent.click(screen.getByRole('button', { name : /save/i }))

    await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
            '/api/users/changingPassword',
            {password : 'newPassword123'},
            {headers: {Authorization: `Bearer fake-token`}}
        )
    })
    
})


test('logout clears token', () => {
    renderProfile()

    localStorage.setItem('token', 'fake-token')

    fireEvent.click(screen.getByRole('button', {name: /logout/i}))
    expect(localStorage.getItem('token')).toBeNull()
    expect(mockSetUser).toHaveBeenCalledWith(null)
    expect(mockNavigate).toHaveBeenCalledWith('/login')
})
