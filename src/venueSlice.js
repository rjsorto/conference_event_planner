// venueSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const venueSlice = createSlice({
	name: 'venue',
	initialState: [
		{
			img: 'https://pixabay.com/images/download/event-venue-1597531_640.jpg',
			name: 'Auditorium Hall',
			cost: 5500,
			capacity: 200,
			quantity: 0,
			available: 3,
		},
		{
			img: 'https://pixabay.com/images/download/convention-center-3908238_640.jpg',
			name: 'Presentation Room',
			cost: 3500,
			capacity: 50,
			quantity: 0,
			available: 10,
		},
		{
			img: 'https://pixabay.com/images/download/chairs-2181916_640.jpg',
			name: 'Conference Room',
			cost: 1100,
			capacity: 15,
			quantity: 0,
			available: 10,
		},
		{
			img: 'https://pixabay.com/images/download/chairs-2181916_640.jpg',
			name: 'Large Meeting Room',
			cost: 900,
			capacity: 10,
			quantity: 0,
			available: 10,
		},
		{
			img: 'https://pixabay.com/images/download/laptops-593296_640.jpg',
			name: 'Small Meeting Room',
			cost: 700,
			capacity: 5,
			quantity: 0,
			available: 10,
		},
	],
	reducers: {
		incrementQuantity: (state, action) => {
			const { payload: index } = action;
			if (state[index]) {
				if (state[index].quantity < state[index].available) state[index].quantity++;
			}
		},
		decrementQuantity: (state, action) => {
			const { payload: index } = action;
			if (state[index] && state[index].quantity > 0) {
				state[index].quantity--;
			}
		},
	},
});

export const { incrementQuantity, decrementQuantity } = venueSlice.actions;

export default venueSlice.reducer;
