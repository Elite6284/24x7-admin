import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const UsersComponent = () => {
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const usersCollection = collection(db, "users");
				const usersSnapshot = await getDocs(usersCollection);
				const usersData = [];

				usersSnapshot.forEach((doc) => {
					const userData = doc.data();
					const userId = doc.id;
					delete userData.password;
					usersData.push({ id: userId, ...userData });
				});

				setUsers(usersData);
			} catch (error) {
				console.error("Error fetching users:", error);
				setError("Error while fetching users.");
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	useEffect(() => {
		if (searchQuery) {
			const filtered = users.filter(
				(user) =>
					user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					user.email.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setFilteredUsers(filtered);
		} else {
			setFilteredUsers(users);
		}
	}, [searchQuery, users]);

	return (
		<div className='w-full px-9 mt-9 p-4 bg-slate-100 shadow-lg rounded-lg'>
			<h2 className='text-xl font-bold mb-4'>User Details</h2>
			<input
				type='text'
				placeholder='Search users...'
				className='w-full p-2 border border-gray-300 rounded mb-4'
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			{loading && <p>Loading...</p>}
			{error && <p className='text-red-500'>Error: {error}</p>}
			{!loading && !error && filteredUsers.length === 0 && (
				<p>No users found.</p>
			)}
			{!loading && !error && filteredUsers.length > 0 && (
				<div className='overflow-x-auto'>
					<table className='min-w-full bg-white border border-gray-300'>
						<thead>
							<tr>
								<th className='border border-gray-300 px-6 py-3'>Name</th>
								<th className='border border-gray-300 px-6 py-3'>Email</th>
								<th className='border border-gray-300 px-6 py-3'>Balance</th>
								<th className='border border-gray-300 px-6 py-3'>
									Edit Balance
								</th>
								{/* Add more fields as needed */}
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((user) => (
								<tr key={user.id}>
									<td className='border border-gray-300 px-6 py-3'>
										{user.name}
									</td>
									<td className='border border-gray-300 px-6 py-3'>
										{user.email}
									</td>
									<td className='border border-gray-300 px-6 py-3'>
										{user.balance}
									</td>
									<td className='border border-gray-300 px-6 py-3'>
										<a href={`/user/${user.id}`}>
											<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
												Edit Balance
											</button>
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default UsersComponent;
