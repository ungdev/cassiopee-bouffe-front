import React, { useEffect, useState } from 'react';

import './preparation.scss';
import Navbar from '../components/navbar';
import moment from 'moment';
import FontAwesome from 'react-fontawesome';
import { Order, Status } from '../types';
import Modal from '../components/modals/modal';
import Loader from '../components/UI/loader';
import Separator from '../components/UI/separator';
import { API } from '../utils/api';

const statusOrder = [
  Status.Cancelled,
  Status.Pending,
  Status.Preparing,
  Status.Ready,
  Status.Finished,
];

const upgradeStatus = (status: Status) => statusOrder[statusOrder.indexOf(status) + 1];
const downgradeStatus = (status: Status) => statusOrder[statusOrder.indexOf(status) - 1];

const Preparation = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // used only to refresh the component every minute
  const [tictac, setTicTac] = useState(false);
  const [loading, setLoading] = useState<Order>(null);
  const [confirmOrder, setConfirmOrder] = useState<Order>(null);
  const [downgradeMode, setDowngradeMode] = useState(false);

  // used only to refresh the component every minute to refresh the duration on the
  useEffect(() => {
    const interval = setInterval(() => {
      setTicTac(!tictac);
    }, 1000 * 60);

    return () => clearInterval(interval);
  });

  // Fetch the orders
  useEffect(() => {
    API.get<Order[]>('/vendors/me/orders').then((response) => {
      setOrders(response.data);
    });
  }, []);

  const editOrder = async (order: Order, confirmed = false) => {
    // If ready to be confirmed
    if (order.status === Status.Ready && !confirmed && !downgradeMode) {
      setConfirmOrder(order);
    }
    // If ready to be cancelled
    else if (order.status === Status.Pending && !confirmed && downgradeMode) {
      setConfirmOrder(order);
    } else {
      if (!loading) {
        setLoading(order);
        try {
          const newStatus = downgradeMode
            ? downgradeStatus(order.status)
            : upgradeStatus(order.status);

          const response = await API.patch<Order>(`/vendors/me/orders/${order.id}`, {
            status: newStatus,
          });

          const orderIndex = orders.findIndex((findOrder) => findOrder.id === order.id);

          // If the status is pending preparing or ready, update it in the state, otherwise, delete it
          if ([Status.Pending, Status.Preparing, Status.Ready].includes(response.data.status)) {
            setOrders([
              ...orders.slice(0, orderIndex),
              response.data,
              ...orders.slice(orderIndex + 1),
            ]);
          } else {
            setOrders([...orders.slice(0, orderIndex), ...orders.slice(orderIndex + 1)]);
          }
        } catch (e) {}
        setLoading(null);
        setConfirmOrder(null);
      }
    }
  };

  const displayOrders = (orders: Array<Order>) => {
    return (
      <div className="orders">
        {orders.map((order) => (
          <div className="order" key={order.id}>
            <div className="titles">
              <span className="place">#{order.displayId}</span>
              <span>{moment(order.createdAt).fromNow(true)}</span>
            </div>
            <ul className="items">
              {order.orderItems.map((orderItem, index) => (
                <li key={index}>{orderItem.item.name}</li>
              ))}
            </ul>
            {loading && loading.id === order.id ? (
              <div className="next">
                <Loader />
              </div>
            ) : (
              <div
                className={`next ${downgradeMode ? 'downgrade' : ''}`}
                onClick={() => editOrder(order)}>
                <FontAwesome name="arrow-right" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar back="/">
        <div
          onClick={() => setDowngradeMode(!downgradeMode)}
          className={`preparation-mode-button ${downgradeMode ? 'downgrade' : ''}`}>
          {!downgradeMode ? 'Aller en arrière' : 'Aller en avant'}
        </div>
      </Navbar>
      <div id="preparation">
        <div className="status pending">
          <span className="title">En attente</span>
          {displayOrders(orders.filter((order) => order.status === Status.Pending))}
        </div>
        <Separator />
        <div className="status preparing">
          <span className="title">Préparation</span>
          {displayOrders(orders.filter((order) => order.status === Status.Preparing))}
        </div>
        <Separator />
        <div className="status ready">
          <span className="title">Prêt</span>
          {displayOrders(orders.filter((order) => order.status === Status.Ready))}
        </div>
      </div>
      <Modal className="preparation-modal" isOpen={!!confirmOrder}>
        {downgradeMode ? (
          <p>Annuler la commande {confirmOrder && confirmOrder.displayId} ?</p>
        ) : (
          <p>La commande {confirmOrder && confirmOrder.displayId} a-t-elle bien été livrée ?</p>
        )}
        <div className="actions">
          <div className="button cancel" onClick={() => setConfirmOrder(null)}>
            {loading ? <Loader /> : 'Annuler'}
          </div>
          <div
            className="button confirm"
            onClick={async () => {
              await editOrder(confirmOrder, true);
              setConfirmOrder(null);
            }}>
            {loading ? <Loader /> : 'Confirmer'}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Preparation;
