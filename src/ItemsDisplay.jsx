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

export default ItemsDisplay;
