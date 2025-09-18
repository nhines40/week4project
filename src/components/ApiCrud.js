import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API_URL = 'http://localhost:3000/api';

const ApiCrud = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/create`, { name, description });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRead = async () => {
    try {
      const response = await axios.get(`${API_URL}/read`);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, { name, description });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleRead();
  }, []);

  return (
    <div>
      <h1>{t('api')}</h1>
      <form onSubmit={handleCreate}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">{t('create')}</button>
      </form>
      <ul>
        {data.map((item) => (
          <li key={item._id}>
            {item.name} - {item.description}
            <button onClick={() => handleUpdate(item._id)}>{t('update')}</button>
            <button onClick={() => handleDelete(item._id)}>{t('delete')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApiCrud;