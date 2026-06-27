import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function AddCarForm({ onSubmit, onClose }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState('Electric Sedan');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  
  // Specs state
  const [horsepower, setHorsepower] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [rangeOrMpg, setRangeOrMpg] = useState('');
  const [drivetrain, setDrivetrain] = useState('');
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Electric Sedan', 'Sports Car', 'Electric SUV', 'Off-road SUV'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!make.trim() || !model.trim() || !price.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (isNaN(year) || year < 1900 || year > 2100) {
      setError('Please enter a valid year.');
      return;
    }
    if (!horsepower.trim() || !acceleration.trim() || !rangeOrMpg.trim() || !drivetrain.trim()) {
      setError('Please fill in all technical specifications.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        make: make.trim(),
        model: model.trim(),
        year: parseInt(year),
        category,
        price: price.trim().startsWith('₹') ? price.trim() : `₹ ${price.trim()}`,
        image: image.trim(),
        specs: {
          horsepower: horsepower.trim(),
          acceleration: acceleration.trim(),
          range_or_mpg: rangeOrMpg.trim(),
          drivetrain: drivetrain.trim()
        },
        description: description.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add car. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Add New Car to Catalog</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh' }}>
            {error && (
              <div className="form-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="car-make">Make *</label>
                <input
                  id="car-make"
                  type="text"
                  className="form-input"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g., Audi, BMW"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="car-model">Model *</label>
                <input
                  id="car-model"
                  type="text"
                  className="form-input"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g., e-tron GT, M5"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="car-year">Year *</label>
                <input
                  id="car-year"
                  type="number"
                  className="form-input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="1900"
                  max="2100"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="car-category">Category *</label>
                <select
                  id="car-category"
                  className="filter-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="car-price">Starting Price *</label>
                <input
                  id="car-price"
                  type="text"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., 75,00,000"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="car-image">Image URL (Optional)</label>
                <input
                  id="car-image"
                  type="url"
                  className="form-input"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Link to image (e.g. Unsplash)..."
                />
              </div>
            </div>

            <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', fontSize: '0.95rem' }}>
              Technical Specifications
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="car-hp">Power (Horsepower) *</label>
                <input
                  id="car-hp"
                  type="text"
                  className="form-input"
                  value={horsepower}
                  onChange={(e) => setHorsepower(e.target.value)}
                  placeholder="e.g., 522 hp"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="car-accel">Acceleration (0-60 MPH) *</label>
                <input
                  id="car-accel"
                  type="text"
                  className="form-input"
                  value={acceleration}
                  onChange={(e) => setAcceleration(e.target.value)}
                  placeholder="e.g., 3.9s"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="car-range">Range / MPG *</label>
                <input
                  id="car-range"
                  type="text"
                  className="form-input"
                  value={rangeOrMpg}
                  onChange={(e) => setRangeOrMpg(e.target.value)}
                  placeholder="e.g., 238 miles range"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="car-drivetrain">Drivetrain *</label>
                <input
                  id="car-drivetrain"
                  type="text"
                  className="form-input"
                  value={drivetrain}
                  onChange={(e) => setDrivetrain(e.target.value)}
                  placeholder="e.g., AWD, RWD"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label" htmlFor="car-desc">Overview / Description *</label>
              <textarea
                id="car-desc"
                className="form-input"
                style={{ minHeight: '80px', resize: 'vertical' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give a short overview highlighting performance, space, comfort..."
                required
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
