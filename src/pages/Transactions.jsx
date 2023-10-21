import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
	collection,
	getDocs,
	updateDoc,
	doc,
	getDoc,
} from "firebase/firestore";

const TransactionsComponent = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const transactionsCollection = collection(db, "transactions");
				const transactionsSnapshot = await getDocs(transactionsCollection);

				const transactionsData = [];

				for (const docRef of transactionsSnapshot.docs) {
					const transactionData = docRef.data();
					const userDocRef = doc(db, "users", transactionData.uid);
					const userDocSnapshot = await getDoc(userDocRef);

					if (userDocSnapshot.exists()) {
						const userData = userDocSnapshot.data();
						transactionsData.push({
							t_id: docRef.id,
							uid: transactionData.uid,
							tid: transactionData.tid,
							amount: transactionData.amount,
							name: userData.name,
							email: userData.email,
							status: transactionData.status,
						});
					}
				}

				setTransactions(transactionsData);
			} catch (error) {
				console.error("Error fetching transactions:", error);
				setError("Error while fetching transactions.");
			} finally {
				setLoading(false);
			}
		};

		fetchTransactions();
	}, []);

	const handleVerifyClick = async (tid, uid, amount) => {
		try {
			console.log("Transaction ID:", tid);
			console.log("User ID:", uid);
			console.log("Amount:", amount);

			const userDocRef = doc(db, "users", uid);
			const userDocSnapshot = await getDoc(userDocRef);

			console.log("User Doc Snapshot:", userDocSnapshot);

			if (userDocSnapshot.exists()) {
				const userData = userDocSnapshot.data();
				console.log("User Data:", userData);

				const currentBalance = userData.balance || 0;
				const newBalance = currentBalance + amount;

				console.log("Current Balance:", currentBalance);
				console.log("New Balance:", newBalance);

				await updateDoc(userDocRef, {
					balance: newBalance,
				});

				const transactionDocRef = doc(db, "transactions", tid);
				await updateDoc(transactionDocRef, {
					status: true,
				});

				// Remove the verified transaction from the list
				setTransactions((prevTransactions) =>
					prevTransactions.filter((transaction) => transaction.t_id !== tid)
				);
			} else {
				setError("User not found.");
			}
		} catch (error) {
			console.error("Error verifying transaction:", error);
			setError("Error while verifying transaction.");
		}
	};

	return (
		<div className='w-full px-9 mt-9 p-4 bg-slate-100 shadow-lg rounded-lg'>
			<h2 className='text-xl font-bold mb-4'>Transactions</h2>
			{loading && <p>Loading...</p>}
			{error && <p className='text-red-500'>Error: {error}</p>}
			{!loading && !error && transactions.length === 0 && (
				<p>No transactions found.</p>
			)}
			{!loading && !error && transactions.length > 0 && (
				<table className='min-w-full bg-white border border-gray-300'>
					<thead>
						<tr>
							<th className='border border-gray-300 px-4 py-2'>
								Transaction ID
							</th>
							<th className='border border-gray-300 px-4 py-2'>Amount</th>
							<th className='border border-gray-300 px-4 py-2'>Name</th>
							<th className='border border-gray-300 px-4 py-2'>Email</th>
							<th className='border border-gray-300 px-4 py-2'>Verify</th>
						</tr>
					</thead>
					<tbody>
						{transactions
							.filter((transaction) => !transaction.status)
							.map((transaction) => (
								<tr key={transaction.tid}>
									<td className='border border-gray-300 px-4 py-2'>
										{transaction.tid}
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										{transaction.amount}
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										{transaction.name}
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										{transaction.email}
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										<button
											className='bg-green-500 hover-bg-green-700 text-white font-bold py-2 px-4 rounded'
											onClick={() =>
												handleVerifyClick(
													transaction.t_id,
													transaction.uid,
													transaction.amount
												)
											}>
											Verify
										</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default TransactionsComponent;
