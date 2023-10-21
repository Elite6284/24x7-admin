import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditUserDetails = () => {
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const [newBalance, setNewBalance] = useState("");

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userDocRef = doc(db, "users", id);
				const userDocSnap = await getDoc(userDocRef);
				if (userDocSnap.exists()) {
					setUser(userDocSnap.data());
				}
			} catch (error) {
				console.error("Error fetching user:", error);
			}
		};

		fetchUser();
	}, [id]);

	const handleUpdateBalance = async () => {
		try {
			const userDocRef = doc(db, "users", id);
			await updateDoc(userDocRef, { balance: newBalance });
			alert("Balance updated successfully!");
			window.location.href = "/users";
		} catch (error) {
			console.error("Error updating balance:", error);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<div className='bg-white p-6 rounded-lg shadow-md w-full md:w-96'>
				{user ? (
					<div className='text-center'>
						<h2 className='text-xl font-bold'>Edit User Details</h2>
						<p>Name: {user.name}</p>
						<p>Email: {user.email}</p>
						<p>Balance: {user.balance}</p>
						<input
							className='p-2 mt-2 w-full border border-gray-300 rounded'
							type='number'
							placeholder='New Balance'
							value={newBalance}
							onChange={(e) => setNewBalance(e.target.value)}
						/>
						<button
							className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
							onClick={handleUpdateBalance}>
							Update Balance
						</button>
					</div>
				) : (
					<p className='text-center'>Loading...</p>
				)}
			</div>
		</div>
	);
};

export default EditUserDetails;
