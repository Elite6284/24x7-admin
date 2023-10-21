import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import { Link } from "react-router-dom";
import Stats from "../components/Stats";
// Import Link from react-router-dom
const Dashboard = () => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const filesCollection = collection(db, "files");
				const filesSnapshot = await getDocs(filesCollection);
				const filesData = filesSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setFiles(filesData);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching data:", err);
				setError("Error while fetching data. Please try again.");
				setLoading(false);
			}
		};

		fetchData();
	}, []); // Empty dependency array to run the effect only once on mount

	const handleDelete = async (id, filePath) => {
		try {
			// Delete from Firestore
			await deleteDoc(doc(db, "files", id));

			const storageRef = ref(storage, filePath);
			await deleteObject(storageRef);

			// Update state to trigger re-render
			setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
		} catch (err) {
			console.error("Error deleting file:", err);
			setError("Error while deleting file. Please try again.");
		}
	};

	return (
		<>
			<Stats />
			<div className='max-w-4xl mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg'>
				<h2 className='text-2xl font-bold mb-4'>Files</h2>
				{loading ? (
					<p>Loading...</p>
				) : error ? (
					<p className='text-red-500'>{error}</p>
				) : files.length === 0 ? (
					<p>No Items</p>
				) : (
					<table className='w-full border-collapse border-t border-b border-gray-300'>
						<thead>
							<tr className='bg-gray-100'>
								<th className='border border-gray-300 px-4 py-2'>Name</th>
								<th className='border border-gray-300 px-4 py-2'>Price</th>
								<th className='border border-gray-300 px-4 py-2'>Actions</th>
							</tr>
						</thead>
						<tbody>
							{files.map((file) => (
								<tr key={file.id}>
									<td className='border border-gray-300 px-4 py-2'>
										{file.name}
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										{file.price}
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										<Link
											to={`/upload/${file.id}`}
											className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2'>
											Edit
										</Link>
										<button
											className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
											onClick={() => handleDelete(file.id, file.filePath)}>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</>
	);
};

export default Dashboard;
