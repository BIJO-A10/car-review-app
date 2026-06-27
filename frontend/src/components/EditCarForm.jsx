import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function EditCarForm({ car, onSubmit, onClose }) {
  const [make, setMake] = useState(car.make);
  const [model, setModel] = useState(car.model);
  const [year, setYear] = useState(car.year);
  const [category, setCategory] = useState(car.category);
  
  // Strip Rupee symbol from input box if present
  const initialPrice = car.price.replace('₹', '').trim();
  const [price, setPrice] = useState(initialPrice);
  const [image, setImage] = useState(car.image);
  const [description, setDescription] = useState(car.description);
  
  // Specs state
  const [horsepower, setHorsepower] = useState(car.specs.horsepower);
  const [acceleration, setAcceleration] = useState(car.specs.acceleration);
  const [rangeOrMpg, setRangeOrMpg] = useState(car.specs.range_or_mpg);
  const [drivetrain, setDrivetrain] = useState(car.specs.drivetrain);
  
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
      setError(err.message || 'Failed to update car details. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Edit {car.make} {car.model}</h3>
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
                <label className="form-label" htmlFor="edit-car-make">Make *</label>
                <input
                  id="edit-car-make"
                  type="text"
                  className="form-input"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="edit-car-model">Model *</label>
                <input
                  id="edit-car-model"
                  type="text"
                  className="form-input"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-car-year">Year *</label>
                <input
                  id="edit-car-year"
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
                <label className="form-label" htmlFor="edit-car-category">Category *</label>
                <select
                  id="edit-car-category"
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
                <label className="form-label" htmlFor="edit-car-price">Starting Price (Rupees) *</label>
                <input
                  id="edit-car-price"
                  type="text"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., 75,00,000"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="edit-car-image">Image URL (Optional)</label>
                <input
                  id="edit-car-image"
                  type="url"
                  className="form-input"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Link to image..."
                />
              </div>
            </div>

            <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', fontSize: '0.95rem' }}>
              Technical Specifications
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-car-hp">Power (Horsepower) *</label>
                <input
                  id="edit-car-hp"
                  type="text"
                  className="form-input"
                  value={horsepower}
                  onChange={(e) => setHorsepower(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="edit-car-accel">Acceleration (0-60 MPH) *</label>
                <input
                  id="edit-car-accel"
                  type="text"
                  className="form-input"
                  value={acceleration}
                  onChange={(e) => setAcceleration(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-car-range">Range / MPG *</label>
                <input
                  id="edit-car-range"
                  type="text"
                  className="form-input"
                  value={rangeOrMpg}
                  onChange={(e) => setRangeOrMpg(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="edit-car-drivetrain">Drivetrain *</label>
                <input
                  id="edit-car-drivetrain"
                  type="text"
                  className="form-input"
                  value={drivetrain}
                  onChange={(e) => setDrivetrain(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label" htmlFor="edit-car-desc">Overview / Description *</label>
              <textarea
                id="edit-car-desc"
                className="form-input"
                style={{ minHeight: '80px', resize: 'vertical' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
