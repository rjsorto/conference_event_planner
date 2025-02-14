import React, { useState } from 'react';
import './ConferenceEvent.css';
import TotalCost from './TotalCost';
import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity } from './venueSlice';
import { incrementAvQuantity, decrementAvQuantity } from './avSlice';
import { toggleMealSelection } from './mealsSlice';

const ConferenceEvent = () => {
	const [showItems, setShowItems] = useState(false);
	const [numberOfPeople, setNumberOfPeople] = useState(1);
	const venueItems = useSelector((state) => state.venue);
	const avItems = useSelector((state) => state.av);
	const mealsItems = useSelector((state) => state.meals);

	const dispatch = useDispatch();

	const toggleItemsBtn = document.querySelector('.details_button');

	const handleToggleItems = (toggleBtn = false) => {
		// console.log('handleToggleItems called');
		let show = false;
		let text = 'Show Details';
		if (toggleBtn && toggleItemsBtn.textContent === text) {
			show = true;
			text = 'Hide Details';
		}
		toggleItemsBtn.textContent = text;
		setShowItems(show);
	};

	const handleAddToCart = (index) => {
		if (!venueAvailable(index)) return;
		dispatch(incrementQuantity(index));
	};

	const handleRemoveFromCart = (index) => {
		if (venueItems[index].quantity > 0) dispatch(decrementQuantity(index));
	};
	const handleIncrementAvQuantity = (index) => {
		dispatch(incrementAvQuantity(index));
	};

	const handleDecrementAvQuantity = (index) => {
		dispatch(decrementAvQuantity(index));
	};

	const handleMealSelection = (index) => {
		const item = mealsItems[index];
		if (item.selected && item.type === 'mealForPeople') {
			const newNumberOfPeople = item.selected ? numberOfPeople : 0;
			dispatch(toggleMealSelection(index, newNumberOfPeople));
		} else {
			dispatch(toggleMealSelection(index));
		}
	};

	const getItemsFromTotalCost = () => {
		const its = [];
		venueItems.forEach((item) => {
			if (item.quantity > 0) its.push({ ...item, type: 'venue' });
		});
		avItems.forEach((item) => {
			if (item.quantity > 0 && !its.some((i) => i.name === item.name && i.type === 'av')) its.push({ ...item, type: 'av' });
		});
		mealsItems.forEach((item) => {
			if (item.selected) {
				const itemForDisplay = { ...item, type: 'meals' };
				if (item.numberOfPeople) itemForDisplay.numberOfPeople = numberOfPeople;
				its.push(itemForDisplay);
			}
		});
		return its;
	};

	const items = getItemsFromTotalCost();

	const ItemsDisplay = ({ items }) => {
		console.log('ITEMS >>>>>', items);
		return (
			<>
				<div className='display_box1'>
					{items.length === 0 && <p>No items selected</p>}
					<table className='table_item_data'>
						<thead>
							<tr>
								<th>Name</th>
								<th>Unit cost</th>
								<th>Quantity</th>
								<th>Subtotal</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item, index) => (
								<tr key={index}>
									<td>{item.name}</td>
									<td>{item.cost}</td>
									<td>{item.type === 'meals' || item.numberOfPeople ? ` For ${numberOfPeople} people` : item.quantity}</td>
									<td>{item.type === 'meals' || item.numberOfPeople ? item.cost * numberOfPeople : item.cost * item.quantity}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</>
		);
	};

	// let totals = 0;

	const calculateTotalCost = (section) => {
		let totalCost = 0;
		section.forEach((item) => {
			const qty = item.quantity ? item.quantity : item.selected ? numberOfPeople : 0;
			totalCost += item.cost * qty;
		});
		// if (isNaN(totalCost)) totalCost = 0;
		// totals += totalCost;
		return !isNaN(totalCost) ? totalCost : 0;
	};

	const navigateToProducts = (idType) => {
		if (idType == '#venue' || idType == '#addons' || idType == '#meals') {
			// if (showItems) {
			// Check if showItems is false
			handleToggleItems(); // Toggle showItems to true only if it's currently false
			// }
		}
	};

	const venueAvailable = (i) => {
		// console.log(venueItems[i].quantity, venueItems[i].available, venueItems[i].quantity <= venueItems[i].available);
		return venueItems[i].quantity < venueItems[i].available;
	};

	const available = (obj) => {
		return obj.quantity < obj.available;
	};

	const btnClassName = (val) => {
		return val ? 'btn-warning btn-plus' : 'btn-warning btn-disabled';
	};

	const venueTotalCost = calculateTotalCost(venueItems);
	const avTotalCost = calculateTotalCost(avItems);
	const mealsTotalCost = calculateTotalCost(mealsItems);

	const totalCosts = {
		venue: venueTotalCost,
		av: avTotalCost,
		meals: mealsTotalCost,
	};

	return (
		<>
			<nav id='navbar' className='navbar_event_conference'>
				<div className='company_logo'>Conference Expense Planner</div>
				<div className='left_navbar'>
					<div className='nav_links'>
						<a href='#venue' onClick={() => navigateToProducts('#venue')}>
							Venue
						</a>
						<a href='#addons' onClick={() => navigateToProducts('#addons')}>
							Add-ons
						</a>
						<a href='#meals' onClick={() => navigateToProducts('#meals')}>
							Meals
						</a>
					</div>
					<a href='#navbar' className='details_button' onClick={() => handleToggleItems(true)} disabled={items.length ? false : true}>
						Show Details
					</a>
				</div>
			</nav>
			<div className='main_container'>
				{!showItems ? (
					<div className='items-information'>
						<div id='venue' className='venue_container container_main'>
							<div className='text'>
								<h1>Venue Room Selection</h1>
							</div>
							<div className='venue_selection'>
								{venueItems.map((item, index) => (
									<div className='venue_main' key={index}>
										<div className='img'>
											<img src={item.img} alt={item.name} />
										</div>
										<div className='text'>
											{item.name} (Capacity:{item.capacity})
										</div>
										<div>${item.cost}</div>
										<div className='button_container'>
											<div className='button_container'>
												<button className={btnClassName(venueItems[index].quantity)} onClick={() => handleRemoveFromCart(index)}>
													&#8211;
												</button>
												<span className='selected_count'>{venueItems[index].quantity ?? '0'}</span>
												<button className={btnClassName(available(venueItems[index]))} onClick={() => handleAddToCart(index)}>
													&#43;
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
							<div className='total_cost'>Total Cost: ${venueTotalCost}</div>
						</div>

						{/*Necessary Add-ons*/}
						<div id='addons' className='venue_container container_main'>
							<div className='text'>
								<h1> Add-ons Selection</h1>
							</div>
							<div className='addons_selection'>
								{avItems.map((item, index) => (
									<div className='av_data venue_main' key={index}>
										<div className='img'>
											<img src={item.img} alt='item.name' />
										</div>
										<div className='text'>{item.name}</div>
										<div>${item.cost}</div>
										<div className='addons_btns'>
											<button className='btn-warning' onClick={() => handleDecrementAvQuantity(index)}>
												&ndash;
											</button>
											<span className='selected_count'>{avItems[index].quantity}</span>
											<button className='btn-success' onClick={() => handleIncrementAvQuantity(index)}>
												&#43;
											</button>
										</div>
									</div>
								))}
							</div>
							<div className='total_cost'>Total Cost: ${avTotalCost}</div>
						</div>

						{/* Meal Section */}

						<div id='meals' className='venue_container container_main'>
							<div className='text'>
								<h1>Meals Selection</h1>
							</div>

							<div className='input-container venue_selection'>
								<label>
									<h3>Number of people:</h3>
									<input type='number' className='input_box5' value={numberOfPeople} min='1' onChange={(e) => setNumberOfPeople(parseInt(e.target.value))} />
								</label>
							</div>
							<div className='meal_selection'>
								{mealsItems.map((item, index) => (
									<div className='meal_item' key={index} style={{ padding: 15 }}>
										<div className='inner'>
											<label>
												<input type='checkbox' checked={item.selected} onChange={() => handleMealSelection(index)} /> {item.name}
											</label>
										</div>
										<div className='meal_cost'>${item.cost}</div>
									</div>
								))}
							</div>
							<div className='total_cost'>Total Cost: ${mealsTotalCost}</div>
						</div>
					</div>
				) : (
					<div className='total_amount_detail'>
						<TotalCost totalCosts={totalCosts} ItemsDisplay={() => <ItemsDisplay items={items} />} />
					</div>
				)}
			</div>
		</>
	);
};

export default ConferenceEvent;
