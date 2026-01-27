import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from './FilterPanel';
import { FilterCriteria } from '../../types';

describe('FilterPanel Component', () => {
  const mockOnFiltersChange = jest.fn();
  const mockOnSearch = jest.fn();

  const defaultFilters: FilterCriteria = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders filter panel with header', () => {
    render(
      <FilterPanel
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        currentFilters={defaultFilters}
        searchQuery=""
      />
    );

    expect(screen.getByText('Advanced Filters')).toBeInTheDocument();
  });

  test('expands and collapses filter content', () => {
    render(
      <FilterPanel
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        currentFilters={defaultFilters}
        searchQuery=""
      />
    );

    const toggleButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(toggleButton);

    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Date From')).toBeInTheDocument();
    expect(screen.getByLabelText('Crime Type')).toBeInTheDocument();
  });

  test('handles search input', () => {
    render(
      <FilterPanel
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        currentFilters={defaultFilters}
        searchQuery=""
      />
    );

    const toggleButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(toggleButton);

    const searchInput = screen.getByPlaceholderText('ID, area, crime type...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  test('handles clear filters button click', () => {
    render(
      <FilterPanel
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        currentFilters={defaultFilters}
        searchQuery=""
      />
    );

    const toggleButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(toggleButton);

    const clearButton = screen.getByText('Clear All Filters');
    fireEvent.click(clearButton);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('displays filter options', () => {
    render(
      <FilterPanel
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        currentFilters={defaultFilters}
        searchQuery=""
      />
    );

    const toggleButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(toggleButton);

    expect(screen.getByLabelText('Area')).toBeInTheDocument();
    expect(screen.getByLabelText('Zone')).toBeInTheDocument();
    expect(screen.getByLabelText('Police Station')).toBeInTheDocument();
    expect(screen.getByLabelText('Severity')).toBeInTheDocument();
  });

  test('does not display active filters when none are set', () => {
    const { container } = render(
      <FilterPanel
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        currentFilters={defaultFilters}
        searchQuery=""
      />
    );

    const toggleButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(toggleButton);

    const activeFilters = container.querySelector('.active-filters');
    expect(activeFilters).not.toBeInTheDocument();
  });

  test('displays active filters when filters are set', () => {
    const filtersWithData: FilterCriteria = {
      ...defaultFilters,
      severity: 'high',
      areas: ['Downtown'],
    };

    const { container } = render(
      <FilterPanel
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        currentFilters={filtersWithData}
        searchQuery=""
      />
    );

    const toggleButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(toggleButton);

    const activeFilters = container.querySelector('.active-filters');
    expect(activeFilters).toBeInTheDocument();
    expect(screen.getByText(/Severity: high/i)).toBeInTheDocument();
    expect(screen.getByText(/Area: Downtown/i)).toBeInTheDocument();
  });
});
