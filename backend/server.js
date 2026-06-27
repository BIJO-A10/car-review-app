import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE_PATH = path.join(__dirname, 'data', 'cars.json');

app.use(cors());
app.use(express.json());

// Helper function to read data
async function readCarsData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
}

// Helper function to write data
async function writeCarsData(data) {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
    throw new Error('Failed to persist review');
  }
}

// GET all cars (supports filters)
app.get('/api/cars', async (req, res) => {
  const { search, make, category } = req.query;
  let cars = await readCarsData();

  // Add calculated fields (average rating and review count)
  cars = cars.map(car => {
    const reviews = car.reviews || [];
    const avgRating = reviews.length > 0
      ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
      : 0;
    return {
      ...car,
      rating: avgRating,
      reviewCount: reviews.length
    };
  });

  // Apply filters if provided
  if (make) {
    cars = cars.filter(car => car.make.toLowerCase() === make.toLowerCase());
  }

  if (category) {
    cars = cars.filter(car => car.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const searchLower = search.toLowerCase();
    cars = cars.filter(car => 
      car.make.toLowerCase().includes(searchLower) ||
      car.model.toLowerCase().includes(searchLower) ||
      car.category.toLowerCase().includes(searchLower) ||
      car.description.toLowerCase().includes(searchLower)
    );
  }

  res.json(cars);
});

// GET single car by ID
app.get('/api/cars/:id', async (req, res) => {
  const cars = await readCarsData();
  const car = cars.find(c => c.id === req.params.id);

  if (!car) {
    return res.status(404).json({ message: 'Car not found' });
  }

  const reviews = car.reviews || [];
  const avgRating = reviews.length > 0
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
    : 0;

  res.json({
    ...car,
    rating: avgRating,
    reviewCount: reviews.length
  });
});

// POST a new review for a car
app.post('/api/cars/:id/reviews', async (req, res) => {
  const { user, rating, title, comment } = req.body;
  const ratingInt = parseInt(rating);

  // Validation
  if (!user || typeof user !== 'string' || user.trim() === '') {
    return res.status(400).json({ message: 'Valid name is required' });
  }
  if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
    return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
  }
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Valid review title is required' });
  }
  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    return res.status(400).json({ message: 'Valid review comment is required' });
  }

  const cars = await readCarsData();
  const carIndex = cars.findIndex(c => c.id === req.params.id);

  if (carIndex === -1) {
    return res.status(404).json({ message: 'Car not found' });
  }

  const newReview = {
    id: `r_${Date.now()}`,
    user: user.trim(),
    rating: ratingInt,
    title: title.trim(),
    comment: comment.trim(),
    date: new Date().toISOString().split('T')[0]
  };

  if (!cars[carIndex].reviews) {
    cars[carIndex].reviews = [];
  }

  cars[carIndex].reviews.unshift(newReview); // Put newest reviews first

  try {
    await writeCarsData(cars);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new car
app.post('/api/cars', async (req, res) => {
  const { make, model, year, category, price, image, specs, description } = req.body;
  const yearInt = parseInt(year);

  // Validation
  if (!make || typeof make !== 'string' || make.trim() === '') {
    return res.status(400).json({ message: 'Make is required' });
  }
  if (!model || typeof model !== 'string' || model.trim() === '') {
    return res.status(400).json({ message: 'Model is required' });
  }
  if (isNaN(yearInt) || yearInt < 1900 || yearInt > 2100) {
    return res.status(400).json({ message: 'Valid year is required' });
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ message: 'Category is required' });
  }
  if (!price || typeof price !== 'string' || price.trim() === '') {
    return res.status(400).json({ message: 'Price is required' });
  }
  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ message: 'Description is required' });
  }
  if (!specs || typeof specs !== 'object') {
    return res.status(400).json({ message: 'Valid specs object is required' });
  }
  const { horsepower, acceleration, range_or_mpg, drivetrain } = specs;
  if (!horsepower || !acceleration || !range_or_mpg || !drivetrain) {
    return res.status(400).json({ message: 'All specifications (horsepower, acceleration, range/mpg, drivetrain) are required' });
  }

  const cars = await readCarsData();
  
  // Generate unique slug id
  const slug = `${make.toLowerCase()}-${model.toLowerCase()}-${yearInt}`.replace(/[^a-z0-9]+/g, '-');
  
  // Check duplicate
  if (cars.some(c => c.id === slug)) {
    return res.status(400).json({ message: 'A car with this make, model, and year already exists' });
  }

  const defaultImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80';

  const newCar = {
    id: slug,
    make: make.trim(),
    model: model.trim(),
    year: yearInt,
    category: category.trim(),
    price: price.trim(),
    image: image && image.trim() !== '' ? image.trim() : defaultImage,
    specs: {
      horsepower: horsepower.trim(),
      acceleration: acceleration.trim(),
      range_or_mpg: range_or_mpg.trim(),
      drivetrain: drivetrain.trim()
    },
    description: description.trim(),
    reviews: []
  };

  cars.push(newCar);

  try {
    await writeCarsData(cars);
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT/update an existing car
app.put('/api/cars/:id', async (req, res) => {
  const { make, model, year, category, price, image, specs, description } = req.body;
  const yearInt = parseInt(year);

  // Validation
  if (!make || typeof make !== 'string' || make.trim() === '') {
    return res.status(400).json({ message: 'Make is required' });
  }
  if (!model || typeof model !== 'string' || model.trim() === '') {
    return res.status(400).json({ message: 'Model is required' });
  }
  if (isNaN(yearInt) || yearInt < 1900 || yearInt > 2100) {
    return res.status(400).json({ message: 'Valid year is required' });
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ message: 'Category is required' });
  }
  if (!price || typeof price !== 'string' || price.trim() === '') {
    return res.status(400).json({ message: 'Price is required' });
  }
  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ message: 'Description is required' });
  }
  if (!specs || typeof specs !== 'object') {
    return res.status(400).json({ message: 'Valid specs object is required' });
  }
  const { horsepower, acceleration, range_or_mpg, drivetrain } = specs;
  if (!horsepower || !acceleration || !range_or_mpg || !drivetrain) {
    return res.status(400).json({ message: 'All specifications (horsepower, acceleration, range/mpg, drivetrain) are required' });
  }

  const cars = await readCarsData();
  const carIndex = cars.findIndex(c => c.id === req.params.id);

  if (carIndex === -1) {
    return res.status(404).json({ message: 'Car not found' });
  }

  // Update the car while preserving the reviews array!
  cars[carIndex] = {
    ...cars[carIndex],
    make: make.trim(),
    model: model.trim(),
    year: yearInt,
    category: category.trim(),
    price: price.trim(),
    image: image && image.trim() !== '' ? image.trim() : cars[carIndex].image,
    specs: {
      horsepower: horsepower.trim(),
      acceleration: acceleration.trim(),
      range_or_mpg: range_or_mpg.trim(),
      drivetrain: drivetrain.trim()
    },
    description: description.trim()
  };

  try {
    await writeCarsData(cars);
    res.json(cars[carIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a car
app.delete('/api/cars/:id', async (req, res) => {
  const cars = await readCarsData();
  const carIndex = cars.findIndex(c => c.id === req.params.id);

  if (carIndex === -1) {
    return res.status(404).json({ message: 'Car not found' });
  }

  cars.splice(carIndex, 1);

  try {
    await writeCarsData(cars);
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
