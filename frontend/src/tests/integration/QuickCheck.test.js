import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuickCheck from '../../pages/QuickCheck';

// Mock image imports
jest.mock('../assets/upload-icon.png', () => 'test-image-url');

// Mock other dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({
    data: { disease: 'Cellulitis', confidence: 0.85 }
  }))
}));

describe('QuickCheck Integration Tests', () => {
  test('renders initial upload interface', () => {
    render(<QuickCheck />);
    
    expect(screen.getByRole('heading', { 
      name: /skin condition quick check/i 
    })).toBeInTheDocument();
    
    expect(screen.getByLabelText(/upload skin image/i)).toBeInTheDocument();
  });

  test('handles file upload and shows preview', async () => {
    render(<QuickCheck />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload skin image/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
      expect(screen.getByRole('button', { 
        name: /check skin condition/i 
      })).toBeEnabled();
    });
  });

  test('submits form and shows results', async () => {
    render(<QuickCheck />);
    
    // Upload file
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/upload skin image/i), { 
      target: { files: [file] } 
    });
    
    // Select symptoms
    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Yes')[0]);
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { 
      name: /check skin condition/i 
    }));
    
    // Verify results
    await waitFor(() => {
      expect(screen.getByText(/cellulitis/i)).toBeInTheDocument();
    });
  });
});