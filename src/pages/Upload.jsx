import { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
	collection,
	addDoc,
	serverTimestamp,
	doc,
	getDoc,
	runTransaction,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

const FileUploadComponent = () => {
	const { id } = useParams();
	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");
	const [price, setPrice] = useState("");
	const [file, setFile] = useState(null);
	const [image, setImage] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			if (id) {
				const fileDocRef = doc(db, "files", id);
				const fileDocSnapshot = await getDoc(fileDocRef);

				if (fileDocSnapshot.exists()) {
					const fileData = fileDocSnapshot.data();
					setName(fileData.name);
					setPrice(String(fileData.price));
				} else {
					setError("No such Log exists!");
				}
			}
		};

		fetchData();
	}, [id]);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		if (!name || !price) {
			setError("Name and price are required.");
			return;
		}

		const storageRef = ref(storage, `files/${file.name}`);
		const imageRef = ref(storage, `images/${image.name}`);

		setUploading(true);

		try {
			// Upload file
			await uploadBytes(storageRef, file);
			const downloadURL = await getDownloadURL(storageRef);

			// Upload image
			await uploadBytes(imageRef, image);
			const imageUrl = await getDownloadURL(imageRef);

			const filesCollection = collection(db, "files");

			await addDoc(filesCollection, {
				name,
				price: parseFloat(price),
				desc,
				filePath: downloadURL,
				imageUrl: imageUrl,
				timestamp: serverTimestamp(),
			});

			setSuccess("Upload successful!");
			setName("");
			setPrice("");
			setFile(null);
			setImage(null);
		} catch (error) {
			console.error("Error uploading file:", error);
			setError("Error uploading file. Please try again.");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className='max-w-md mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg'>
			<form onSubmit={handleFormSubmit}>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='name'>
						Name:
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						id='name'
						type='text'
						placeholder='Enter name'
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='desc'>
						Description:
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						id='desc'
						type='text'
						placeholder='Enter description'
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='price'>
						Price:
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						id='price'
						type='text'
						placeholder='Enter price'
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='file'>
						Choose File:
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						id='file'
						type='file'
						accept='.txt'
						onChange={handleFileChange}
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='image'>
						Choose Image:
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						id='image'
						type='file'
						accept='image/*'
						onChange={(e) => setImage(e.target.files[0])}
						required
					/>
				</div>
				<div className='text-center'>
					<button
						className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
							uploading ? "opacity-50 cursor-not-allowed" : ""
						}`}
						type='submit'
						disabled={uploading}>
						{uploading ? "Uploading..." : "Submit"}
					</button>
				</div>
				{error && <div className='text-red-500 mt-2'>{error}</div>}
				{success && <div className='text-green-500 mt-2'>{success}</div>}
			</form>
		</div>
	);
};

export default FileUploadComponent;
