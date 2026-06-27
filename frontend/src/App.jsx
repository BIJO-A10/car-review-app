import React, { useState, useEffect } from 'react';
import { Car, Search, SlidersHorizontal, RefreshCw, XCircle } from 'lucide-react';
import CarCard from './components/CarCard';
import CarDetails from './components/CarDetails';
import ReviewForm from './components/ReviewForm';
import AddCarForm from './components/AddCarForm';
import EditCarForm from './components/EditCarForm';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Selected detail & Modal states
  const [selectedCar, setSelectedCar] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [showEditCarForm, setShowEditCarForm] = useState(false);

  // Categories and Makes list for dropdowns (could also be fetched, but defined here for simplicity)
  const categories = ['Electric Sedan', 'Sports Car', 'Electric SUV', 'Off-road SUV'];
  const makes = ['Tesla', 'Porsche', 'Ford', 'Land Rover'];

  // Fetch all cars
  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedMake) params.append('make', selectedMake);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`${API_BASE_URL}/cars?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to load cars list');
      const data = await response.json();
      setCars(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure the Node.js API is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch full car details (including reviews)
  const fetchCarDetails = async (carId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cars/${carId}`);
      if (!response.ok) throw new Error('Failed to retrieve car details');
      const data = await response.json();
      setSelectedCar(data);
      
      // Also update the car's entry in the main list just in case
      setCars(prevCars => prevCars.map(c => c.id === carId ? data : c));
    } catch (err) {
      console.error(err);
      alert('Failed to refresh car details.');
    }
  };

  // Handle new review submission
  const handleReviewSubmit = async (reviewData) => {
    if (!selectedCar) return;
    
    const response = await fetch(`${API_BASE_URL}/cars/${selectedCar.id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Failed to submit review');
    }

    // Refresh details to show new review and update average rating
    await fetchCarDetails(selectedCar.id);
    // Refresh cars list to update grid summary scores
    await fetchCars();
  };

  // Handle new car submission
  const handleAddCarSubmit = async (carData) => {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(carData)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Failed to add car');
    }

    // Refresh cars list to update grid catalog
    await fetchCars();
  };

  // Handle car deletion
  const handleDeleteCar = async (carId) => {
    const response = await fetch(`${API_BASE_URL}/cars/${carId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Failed to delete car');
    }

    setSelectedCar(null);
    await fetchCars();
  };

  // Handle edit car submission
  const handleEditCarSubmit = async (updatedCarData) => {
    if (!selectedCar) return;

    const response = await fetch(`${API_BASE_URL}/cars/${selectedCar.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCarData)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Failed to update car details');
    }

    // Refresh details to show edited specifications
    await fetchCarDetails(selectedCar.id);
    // Refresh cars list to update grid
    await fetchCars();
  };

  // Run fetch on filter change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCars();
    }, 300); // Debounce search typings

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedMake, selectedCategory]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMake('');
    setSelectedCategory('');
  };

  return (
    <div className="app-wrapper fade-in">
      <header className="app-header">
        <div className="container header-content">
          <div className="logo-container">
            <Car className="logo-icon" size={28} />
            <h1 className="logo-text">AutoVibe</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={() => setShowAddCarForm(true)}>
              Add Car
            </button>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Docs
            </a>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <h2 className="hero-title">Discover and Rate <span>Your Next Ride</span></h2>
          <p className="hero-subtitle">
            Get transparent specs, average owner ratings, and in-depth reviews on top modern vehicles.
          </p>
        </section>

        {/* Search & Filter Control Card */}
        <section className="controls-card">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by make, model, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filters-wrapper">
            <select
              className="filter-select"
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
            >
              <option value="">All Makes</option>
              {makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {(searchQuery || selectedMake || selectedCategory) && (
              <button className="btn btn-secondary" onClick={handleResetFilters}>
                <RefreshCw size={14} /> Clear
              </button>
            )}
          </div>
        </section>

        {/* Cars List Grid */}
        {loading && cars.length === 0 ? (
          <div className="no-results">
            <RefreshCw className="no-results-icon animate-spin" size={36} style={{ animation: 'spin 1.5s linear infinite' }} />
            <p className="no-results-text">Loading catalog...</p>
          </div>
        ) : error ? (
          <div className="no-results" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <XCircle className="no-results-icon" size={36} style={{ color: '#f87171' }} />
            <p className="no-results-text" style={{ color: '#f87171' }}>Connection Error</p>
            <p className="no-results-sub">{error}</p>
            <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }} onClick={fetchCars}>
              Retry Connection
            </button>
          </div>
        ) : (
          <section className="cars-grid">
            {cars.length > 0 ? (
              cars.map(car => (
                <CarCard
                  key={car.id}
                  car={car}
                  onClick={() => fetchCarDetails(car.id)}
                />
              ))
            ) : (
              <div className="no-results">
                <SlidersHorizontal className="no-results-icon" size={36} />
                <p className="no-results-text">No cars match your filters</p>
                <p className="no-results-sub">Try adjusting your keywords or clearing the category selections.</p>
                <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }} onClick={handleResetFilters}>
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Car Details View Drawer */}
      {selectedCar && (
        <CarDetails
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onAddReviewClick={() => setShowReviewForm(true)}
          onEditClick={() => setShowEditCarForm(true)}
          onDeleteClick={handleDeleteCar}
        />
      )}

      {/* Add Review Modal */}
      {showReviewForm && selectedCar && (
        <ReviewForm
          carName={`${selectedCar.make} ${selectedCar.model}`}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* Add Car Modal */}
      {showAddCarForm && (
        <AddCarForm
          onClose={() => setShowAddCarForm(false)}
          onSubmit={handleAddCarSubmit}
        />
      )}

      {/* Edit Car Modal */}
      {showEditCarForm && selectedCar && (
        <EditCarForm
          car={selectedCar}
          onClose={() => setShowEditCarForm(false)}
          onSubmit={handleEditCarSubmit}
        />
      )}
    </div>
  );
}
