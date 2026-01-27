import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders app header with title', () => {
    render(<App />);
    const header = screen.getByText(/SafeCity MVP/i);
    expect(header).toBeInTheDocument();
  });

  test('displays total FIRs count', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Total FIRs:/i)).toBeInTheDocument();
    });
  });

  test('loads preloaded data on mount', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Total FIRs: 3/i)).toBeInTheDocument();
    });
  });

  test('displays hotspots section', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Crime Hotspots')).toBeInTheDocument();
    });
  });

  test('displays FIR records table', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('FIR Records')).toBeInTheDocument();
      expect(screen.getByText('Crime Type')).toBeInTheDocument();
    });
  });

  test('displays statistics cards', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Total FIRs Analyzed')).toBeInTheDocument();
      expect(screen.getByText('Total Hotspots')).toBeInTheDocument();
      expect(screen.getByText('High-Risk Zones')).toBeInTheDocument();
      expect(screen.getByText('Medium-Risk Zones')).toBeInTheDocument();
    });
  });

  test('reset filters button works', async () => {
    render(<App />);
    const resetButton = await screen.findByText('Reset Filters');
    fireEvent.click(resetButton);
    await waitFor(() => {
      expect(screen.getByText(/Total FIRs: 3/i)).toBeInTheDocument();
    });
  });

  test('displays insights sections', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Peak Crime Hours')).toBeInTheDocument();
      expect(screen.getByText('Top Crime Types')).toBeInTheDocument();
    });
  });

  test('renders footer', () => {
    render(<App />);
    const footer = screen.getByText(/SafeCity MVP v0.1.0/i);
    expect(footer).toBeInTheDocument();
  });
});
