import React, { useEffect, useState } from 'react';

import './items.scss';
import Navbar from '../components/navbar';
import Switch from '../components/UI/switch';
import { useSelector } from 'react-redux';
import { State, Item as ItemType, Order, Vendor } from '../types';
import FontAwesome from 'react-fontawesome';
import { formatPrice } from '../utils/helpers';
import { API } from '../utils/api';

const Item = ({
  item,
  onUpdateItem,
}: {
  item: ItemType;
  onUpdateItem: (item: ItemType) => void;
}) => {
  const toogleItem = async () => {
    const updatedItem = await API.patch<ItemType>(`/vendors/me/items/${item.id}`, {
      available: !item.available,
    });

    onUpdateItem(updatedItem.data);
  };

  return (
    <div className="item" onClick={toogleItem}>
      <div className="left-side">
        <Switch on={item.available} />
        <span>{item.name}</span>
      </div>
      <div>{formatPrice(item.price)}</div>
    </div>
  );
};

const Items = () => {
  const [items, setItems] = useState<ItemType[]>([]);

  // Fetch the items
  useEffect(() => {
    API.get<Vendor>('/vendors/me').then((response) => {
      setItems(response.data.items);
    });
  }, []);

  const updateItem = (item: ItemType) => {
    const itemIndex = items.findIndex((findItem) => findItem.id === item.id);

    setItems([...items.slice(0, itemIndex), item, ...items.slice(itemIndex + 1)]);
  };

  return (
    <>
      <Navbar back="/" />
      <div id="items">
        <div className="stats">
          Items disponibles : {items.filter((item) => item.available).length}
        </div>
        <div className="categories">
          {items.map((item) => (
            <Item item={item} key={item.id} onUpdateItem={updateItem} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Items;
