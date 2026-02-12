import Home from "../../src/components/Home.jsx";
import { beforeEach, expect,test,vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

vi.mock('axios')


const mockNotes = [
    {
        _id: '1',
        title: "haha",
        description: "this isnt happening",
        updatedAt: '2024-01-20T10:00:00Z'
    },
    {
        _id: '2',
        title: "faiz",
        description: "lets see ",
        updatedAt: '2025-01-20T10:00:00Z'
    }
]

beforeEach( () => {
    vi.clearAllMocks()
    localStorage.clear()
})

test('fetches adn displays notes when loaded', async () => {

    localStorage.setItem('token', 'fake-token')
    axios.get.mockResolvedValue({data: mockNotes})

    render(
        <MemoryRouter >
            <Home />
        </MemoryRouter>
    )

    await waitFor( () => {
        expect(screen.getByText('haha')).toBeInTheDocument()
        expect(screen.getByText('faiz')).toBeInTheDocument()
    }  )


    expect(axios.get).toHaveBeenCalledWith(
        '/api/notes',
        {headers: {Authorization: `Bearer fake-token`}}
    )
})



test('filters notes based on search', async() => {

    localStorage.setItem('token', 'fake-token')
    axios.get.mockResolvedValue({data: mockNotes})

    render(
        <MemoryRouter initialEntries={['/?search=faiz']}>
            <Home />
        </MemoryRouter>
    )

    await waitFor(() => {
        expect(screen.getByText(/lets see/i)).toBeInTheDocument()
        expect(screen.queryByText(/happening/i)).not.toBeInTheDocument()
    })
})


test('returns error when token is missing', async () => {
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    )

    await waitFor(() => {
        expect(screen.getByText(/no authentication token found/i)).toBeInTheDocument()
    })
})