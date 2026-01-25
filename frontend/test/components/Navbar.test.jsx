
import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react' 
import Navbar from '../../src/components/Navbar'
import { MemoryRouter, useNavigate } from 'react-router-dom'



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

test('dont show search in profile, otherwise make it visible', () => {
    const { unmount } = render(
        <MemoryRouter initialEntries={['/']}>
          <Navbar user={mockUser} setUser={mockSetUser} />
        </MemoryRouter>
    )
    expect(screen.queryByPlaceholderText(/search notes/i)).toBeInTheDocument()
    
    unmount()
    
    render(
        <MemoryRouter initialEntries={['/profile']}>
            <Navbar user={mockUser} setUser={mockSetUser} />
        </MemoryRouter>
    )
    expect(screen.queryByPlaceholderText(/search notes/i)).not.toBeInTheDocument()
})



