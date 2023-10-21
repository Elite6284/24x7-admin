import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className='bg-blue-500 p-4'>
			<div className='container mx-auto flex justify-between items-center'>
				<div className='text-white font-bold text-xl'>Dashboard</div>
				<div className='flex space-x-4'>
					<NavLink to='/dashboard'>Dashboard</NavLink>
					<NavLink to='/upload'>Upload</NavLink>
					<NavLink to='/transactions'>Transactions</NavLink>
					<NavLink to='/users'>Users</NavLink>
				</div>
			</div>
		</nav>
	);
};

const NavLink = ({ to, children }) => (
	<Link
		to={to}
		className='text-white hover:text-gray-300 px-2 py-1 rounded focus:outline-none focus:shadow-outline'>
		{children}
	</Link>
);

export default Navbar;
