import React, { useEffect, useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets'; 
import axios from 'axios';
import { toast } from 'react-toastify';


const Add = ({url}) => {
  
  const [image, setImage] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "MHP Specials"
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const onSubmitHandler = async (event) => { 
    event.preventDefault(); // fixed typo ✅

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "MHP Specials"
        })
        setImage(false); 
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    
    }

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload Area" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder="Type here" />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder="Write content here" required></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select onChange={onChangeHandler} value={data.category} name="category">
              <option value="MHP Specials">Specials</option>
              <option value="Biryani Kingdom">Biryani Kingdom</option>
              <option value="Flavours of South">Flavours of South</option>
              <option value="Signature Starters">Signature Starters</option>
              <option value="Fast-Food Express">Fast-Food Express</option>
              <option value="Zero Proof Bar">Zero Proof Bar</option>
              <option value="Ice Cream Cart">Ice Cream Cart</option>
              <option value="The Cake Co.">The Cake Co.</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="20" />
          </div>
        </div>

        <button type="submit" className="add-btn">Add</button>
      </form>
    </div>
  );
};

export default Add;
