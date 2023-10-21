import React, { useEffect, useState } from "react";
import { collection, query, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Import your Firebase configuration

const Stats = () => {
	const [revenue, setRevenue] = useState(0);
	const [sales, setSales] = useState(0);
	const [userCount, setUserCount] = useState(0);
	const [logCount, setLogCount] = useState(0);

	useEffect(() => {
		// Fetch revenue and sales from "stats" collection
		const getStats = async () => {
			const statsDocRef = doc(db, "stats", "72sv0mvdAH8OeGZqejYy");
			const statsDoc = await getDoc(statsDocRef);

			setRevenue(statsDoc.data().revenue || 0);
			setSales(statsDoc.data().sales || 0);
			// Fetch user count from "users" collection
			const usersCollectionRef = collection(db, "users");
			const usersQuery = query(usersCollectionRef);

			getDocs(usersQuery)
				.then((querySnapshot) => {
					setUserCount(querySnapshot.size);
				})
				.catch((error) => {
					console.error("Error fetching user count:", error);
				});

			// Fetch log count from "files" collection
			const filesCollectionRef = collection(db, "files");
			const filesQuery = query(filesCollectionRef);

			getDocs(filesQuery)
				.then((querySnapshot) => {
					setLogCount(querySnapshot.size);
				})
				.catch((error) => {
					console.error("Error fetching log count:", error);
				});
		};
		getStats();
	}, []);

	return (
		<div className='bg-gray-200 p-4'>
			<div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<StatBox title='Revenue' value={`$${revenue}`} />
				<StatBox title='Sales' value={sales} />
				<StatBox title='Users' value={userCount} />
				<StatBox title='Total Logs' value={logCount} />
			</div>
		</div>
	);
};

const StatBox = ({ title, value }) => {
	return (
		<div className='bg-white p-4 rounded shadow'>
			<h3 className='text-lg font-semibold mb-2'>{title}</h3>
			<p className='text-2xl font-bold'>{value}</p>
		</div>
	);
};

export default Stats;
