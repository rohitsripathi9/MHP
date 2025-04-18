import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'




const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout =()=>{
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }

  const handleOrdersClick = () => {
    navigate('/myorders');
  }

  return (
    <div className="navbar">
      <Link to='/'><img src={assets.logo} alt="Logo" className="logo" /></Link>

      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#testimonial-section' onClick={() => setMenu("testimonial-section")} className={menu === "testimonial-section" ? "active" : ""}>voices of trust</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>
      </ul>

      <div className="navbar-right">
        <Link to='/'><img src={assets.search_icon} alt="Search" /></Link>
        <div className="navbar-search-icon">
          <Link to='/cart'>
            <img src={assets.bag1} alt="Cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src="/uuu.png" alt="Profile" className="navbar-profile-img" />
            <ul type="None" className="navbar-profile-dropdown">
              <li onClick={handleOrdersClick} className="dropdown-item">
                <img src={assets.bag_icon} alt="Orders" />
                <p>orders</p>
              </li>
              <hr />
              <li onClick={logout} className="dropdown-item">
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
