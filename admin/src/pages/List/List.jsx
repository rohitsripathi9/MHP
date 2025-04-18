  import React, { useEffect, useState } from 'react';
  import './List.css';
  import { toast } from 'react-toastify';
  import axios from 'axios';

  const List = ({url}) => {
    
    const [list, setList] = useState([]); // Correct use of useState

    const fetchList = async () => {
    
        const response = await axios.get(`${url}/api/food/list`);
      
        if (response.data.success) {
          setList(response.data.data);
        } else {
          toast.error("error");
        }
      
    };

    const removeFood = async (foodId) => {
      const response = await axios.post(`${url}/api/food/remove/`,{foodid :foodId});
      await fetchList();
      if(response.data.success){
        toast.success(response.data.message);
      }    
      else{
        toast.error(response.data.message);
      }
    }
    useEffect(() => {
      fetchList();
    }, []);

    return (
      <div className="list add flex-col">
        <p>All foods list</p>
        <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>
          {list.map((item, index) => (
            <div key={index} className="list-table-format">
<img className="food-img" src={`${url}/images/${item.image}`} alt={item.name} />
<p>{item.name}</p>
              <p>{item.category}</p>
              <p className="price-circle">{item.price}</p>
              <p onClick = {()=> removeFood(item._id)} className='cursor'>x</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default List;