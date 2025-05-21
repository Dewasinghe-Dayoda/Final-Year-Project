import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../auth/Login';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ 
    data: { token: 'mock-token', user: { id: 1, name: 'Test User' } }
  }))
}));

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });
});